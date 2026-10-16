// Offline SDK inspection, not deployed-function or business-behavior tests.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const root = path.resolve(__dirname, "..");
const build = process.env.SEMA_SCHEMA_CHECK_DIR
  ? path.resolve(process.env.SEMA_SCHEMA_CHECK_DIR)
  : path.join(root, ".verification");
const manifest = JSON.parse(
  fs.readFileSync(path.join(root, "physical-model.json"), "utf8"),
);
const packageSpec = JSON.parse(
  fs.readFileSync(path.join(root, "package.json"), "utf8"),
);
function packageRoot(entry, expectedName) {
  let current = path.dirname(require.resolve(entry));
  for (;;) {
    const p = path.join(current, "package.json");
    if (fs.existsSync(p)) {
      const candidate = JSON.parse(fs.readFileSync(p, "utf8"));
      if (candidate.name === expectedName)
        return { directory: current, ...candidate };
    }
    const parent = path.dirname(current);
    assert.notEqual(parent, current, `Could not locate ${expectedName}`);
    current = parent;
  }
}
const sdk = packageRoot("convex/server", "convex");
const compiler = packageRoot("typescript/package.json", "typescript");
assert.equal(
  sdk.version,
  packageSpec.dependencies.convex,
  "Use the pinned SDK for this check",
);
assert.equal(
  compiler.version,
  packageSpec.devDependencies.typescript,
  "Use the pinned compiler for this check",
);
fs.mkdirSync(build, { recursive: true });
const paths = { "convex/*": [path.join(sdk.directory, "*")] };
const include = [
  path.join(root, "convex/**/*.ts"),
  path.join(root, "contracts/**/*.ts"),
  path.join(root, "checks/**/*.ts"),
];
const checkConfig = path.join(build, "tsconfig.check.json");
const emitConfig = path.join(build, "tsconfig.inspect.json");
fs.writeFileSync(
  checkConfig,
  JSON.stringify(
    {
      extends: path.join(root, "tsconfig.json"),
      compilerOptions: { paths },
      include,
      exclude: [],
    },
    null,
    2,
  ),
);
fs.writeFileSync(
  emitConfig,
  JSON.stringify(
    {
      extends: checkConfig,
      compilerOptions: {
        noEmit: false,
        module: "NodeNext",
        moduleResolution: "NodeNext",
        rootDir: root,
        outDir: path.join(build, "compiled"),
      },
    },
    null,
    2,
  ),
);
const compilerBin = path.join(compiler.directory, "bin/tsc");
for (const config of [checkConfig, emitConfig]) {
  const result = spawnSync(process.execPath, [compilerBin, "-p", config], {
    encoding: "utf8",
  });
  if (result.status !== 0)
    throw new Error(
      result.stdout + result.stderr + (result.error?.message || ""),
    );
}

const schema = require(path.join(build, "compiled/convex/schema.js")).default;
const contracts = require(
  path.join(build, "compiled/contracts/public.js"),
).publicContracts;
const constants = require(path.join(build, "compiled/convex/constants.js"));
const exported = JSON.parse(schema.export());
assert.match(
  fs.readFileSync(path.join(root, "convex/schema.ts"), "utf8"),
  /strictTableNameTypes:\s*true/,
);
assert.equal(exported.schemaValidation, true);
const tableNames = new Set(exported.tables.map((t) => t.tableName));
assert.equal(tableNames.size, 40);
assert.deepEqual([...tableNames].sort(), Object.keys(manifest.tables).sort());
assert.equal(Object.keys(manifest.logicalToPhysical).length, 54);
for (const physical of Object.values(manifest.logicalToPhysical))
  assert(tableNames.has(physical));

let referenceCount = 0;
function inspectType(type) {
  assert.notEqual(type.type, "any", "No unrestricted validators");
  if (type.type === "id") {
    assert(
      type.tableName === "_storage" || tableNames.has(type.tableName),
      `Unknown table ${type.tableName}`,
    );
    referenceCount++;
  } else if (type.type === "object") {
    for (const value of Object.values(type.value)) inspectType(value.fieldType);
  } else if (type.type === "union") {
    for (const variant of type.value) inspectType(variant);
  } else if (type.type === "array") inspectType(type.value);
}
function fieldAt(type, dotted) {
  for (const segment of dotted.split(".")) {
    assert.equal(type.type, "object", `Non-object at ${dotted}`);
    assert(type.value[segment], `Missing index field ${dotted}`);
    type = type.value[segment].fieldType;
  }
  return type;
}
let ordinaryIndexes = 0;
for (const table of exported.tables) {
  const expected = manifest.tables[table.tableName];
  assert.deepEqual(
    Object.keys(table.documentType.value).sort(),
    Object.keys(expected.fields).sort(),
  );
  inspectType(table.documentType);
  const names = new Set();
  for (const index of table.indexes) {
    assert(!names.has(index.indexDescriptor));
    names.add(index.indexDescriptor);
    assert.deepEqual(index.fields, expected.indexes[index.indexDescriptor]);
    assert.equal(new Set(index.fields).size, index.fields.length);
    for (const field of index.fields) {
      assert(!field.startsWith("_"));
      fieldAt(table.documentType, field);
    }
    ordinaryIndexes++;
  }
  assert.equal(table.indexes.length, Object.keys(expected.indexes).length);
}
const retrieval = exported.tables.find(
  (t) => t.tableName === "retrievalEntries",
);
assert.equal(retrieval.vectorIndexes.length, 1);
assert.equal(retrieval.searchIndexes.length, 1);
const vector = retrieval.vectorIndexes[0];
assert.equal(vector.dimensions, 1024);
assert.equal(vector.dimensions, constants.EMBEDDING_DIMENSIONS);
assert.deepEqual(vector.filterFields, ["retrievalScope"]);
assert.deepEqual(retrieval.searchIndexes[0].filterFields, ["retrievalScope"]);
fieldAt(retrieval.documentType, vector.vectorField);
fieldAt(retrieval.documentType, retrieval.searchIndexes[0].searchField);

const forbiddenVisitorFields = new Set([
  "authUserId",
  "tokenDigest",
  "notes",
  "contact",
  "storageId",
  "billingAccountId",
  "payerPhone",
  "payerPhoneCiphertext",
  "providerReference",
  "validationPassed",
]);
function inspectVisitor(type) {
  if (type.type === "object") {
    for (const [name, value] of Object.entries(type.value)) {
      assert(
        !forbiddenVisitorFields.has(name),
        `Private field in visitor DTO: ${name}`,
      );
      inspectVisitor(value.fieldType);
    }
  } else if (type.type === "union") type.value.forEach(inspectVisitor);
  else if (type.type === "array") inspectVisitor(type.value);
}
assert.equal(Object.keys(contracts).length, 22);
for (const [name, contract] of Object.entries(contracts)) {
  assert(contract.auth && contract.transport);
  inspectType(contract.args.json);
  inspectType(contract.returns.json);
  if (name.startsWith("visitor.") || name === "widget.bootstrap")
    inspectVisitor(contract.returns.json);
}
assert.equal(constants.LAUNCH_OFFERS.starter.baseMinor, 250000);
assert.equal(constants.LAUNCH_OFFERS.starter.units, 1000);
assert.equal(constants.LAUNCH_OFFERS.starter.seats, 2);
assert.equal(constants.LAUNCH_OFFERS.pilot.units, 100);
assert.equal(constants.LAUNCH_OFFERS.topup.baseMinor, 50000);
assert.equal(constants.LAUNCH_OFFERS.topup.units, 100);
assert.equal(constants.LIMITS.topupMs, 90 * 86400000);
assert.equal(constants.LIMITS.pilotMs, 30 * 86400000);
assert.equal(constants.LIMITS.paidGraceMs, 3 * 86400000);
assert.equal(constants.LIMITS.totalAnswerTimeoutMs, 20000);
const report = {
  artifactVersion: "1.0",
  checkedAt: new Date().toISOString(),
  toolchain: {
    node: process.version,
    convex: sdk.version,
    typescript: compiler.version,
  },
  passed: {
    bundlerTypeCheck: true,
    nodeInspectionTypeCheck: true,
    realSdkSchemaInstantiation: true,
    schemaValidationEnabled: true,
    strictTableNamesAndPrivateDtoNegativeTypeChecks: true,
    physicalTables: tableNames.size,
    logicalRecordsMapped: 54,
    ordinaryIndexesChecked: ordinaryIndexes,
    idReferencesChecked: referenceCount,
    vectorIndexes: 1,
    vectorDimensions: 1024,
    searchIndexes: 1,
    publicOperationContracts: Object.keys(contracts).length,
    explicitVisitorDtoPrivateFieldExclusion: true,
    commercialConstantChecks: true,
  },
  notTested: [
    "Deployed schema acceptance or generated application handlers",
    "Actual authorization, session revocation, tenant isolation or concurrent mutations",
    "Runtime semantic bounds, malicious-file isolation or SSRF enforcement",
    "Model/provider calls, bilingual RAG quality or performance",
    "M-Pesa charges, refunds, taxes, fees or provider reconciliation",
    "Real deletion, component/file recovery, free-tier capacity or legal/vendor eligibility",
  ],
};
fs.writeFileSync(
  path.join(root, "verification.json"),
  JSON.stringify(report, null, 2) + "\n",
);
console.log(JSON.stringify(report, null, 2));
