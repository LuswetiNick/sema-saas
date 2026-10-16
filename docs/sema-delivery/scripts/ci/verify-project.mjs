import fs from "node:fs";
import path from "node:path";

// Structural preflight for the future application. Tests remain independently required.
const root = process.cwd();
const errors = [];
const readText = (name) => {
  try {
    return fs.readFileSync(path.join(root, name), "utf8");
  } catch {
    errors.push(`${name}: missing or unreadable`);
    return "";
  }
};
const readJson = (name) => {
  try {
    return JSON.parse(fs.readFileSync(path.join(root, name), "utf8"));
  } catch {
    errors.push(`${name}: missing or invalid JSON`);
    return {};
  }
};
const pkg = readJson("package.json");
const web = readJson("apps/web/package.json");
const ui = readJson("packages/ui/package.json");
const lock = readText("pnpm-lock.yaml");
const workspace = readText("pnpm-workspace.yaml");

if (
  !/^pnpm@\d+\.\d+\.\d+(?:\+sha(?:224|256|384|512)\.[0-9a-f]+)?$/.test(
    pkg.packageManager ?? "",
  )
) {
  errors.push("Pin an exact pnpm version in package.json#packageManager");
}
if (web.name !== "@sema/web" || ui.name !== "@sema/ui") {
  errors.push("Expected @sema/web in apps/web and @sema/ui in packages/ui");
}
if (web.dependencies?.["@sema/ui"] !== "workspace:*") {
  errors.push("apps/web must depend on @sema/ui through workspace:*");
}

// Structural checks only. The frozen install must parse YAML and verify all
// workspace manifests, dependency resolutions, settings and integrity records.
if (
  !/^packages:\s*$/m.test(workspace) ||
  !/^\s+-\s+["']?apps\/\*["']?\s*$/m.test(workspace) ||
  !/^\s+-\s+["']?packages\/\*["']?\s*$/m.test(workspace)
) {
  errors.push("pnpm-workspace.yaml must include apps/* and packages/*");
}
if (
  !/^lockfileVersion:\s*["']?9(?:\.0)?["']?\s*$/m.test(lock) ||
  !/^importers:\s*$/m.test(lock) ||
  !/^packages:\s*$/m.test(lock) ||
  !/^snapshots:\s*$/m.test(lock)
) {
  errors.push("Commit a complete pnpm-lock.yaml with lockfileVersion 9.0");
}
for (const importer of [".", "apps/web", "packages/ui"]) {
  const escaped = importer.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const importerPattern = new RegExp(
    `^  ["']?${escaped}["']?:[ \\t]*(?:\\{\\})?[ \\t]*$`,
    "m",
  );
  if (!importerPattern.test(lock)) {
    errors.push(`pnpm-lock.yaml is missing workspace importer: ${importer}`);
  }
}
const required = [
  "format:check",
  "lint",
  "typecheck",
  "ci:security",
  "test:unit",
  "test:convex",
  "test:rag:fixtures",
  "build",
  "test:e2e",
];

for (const name of required) {
  const command = pkg.scripts?.[name];
  if (typeof command !== "string" || !command.trim()) {
    errors.push(`Required application script is missing: ${name}`);
  } else if (
    /--if-present|--passWithNoTests|--pass-with-no-tests|\|\|\s*true/.test(
      command,
    )
  ) {
    errors.push(`Check must not silently skip or suppress failure: ${name}`);
  } else if (/^\s*(?:echo\b|true\s*$|exit\s+0\s*$)/.test(command)) {
    errors.push(`Check must execute an implemented tool or suite: ${name}`);
  }
}

for (const name of [
  "next",
  "react",
  "convex",
  "better-auth",
  "@convex-dev/better-auth",
]) {
  const value = web.dependencies?.[name];
  if (
    typeof value !== "string" ||
    !/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(value)
  ) {
    errors.push(`Adopt an exact reviewed dependency in apps/web: ${name}`);
  }
}
try {
  const pin = fs.readFileSync(path.join(root, ".node-version"), "utf8").trim();
  if (!/^\d+\.\d+\.\d+$/.test(pin))
    errors.push(".node-version must contain an exact runtime version");
  else if (process.versions.node !== pin)
    errors.push("Running Node does not match .node-version");
} catch {
  errors.push("Missing .node-version");
}
if (errors.length) {
  for (const error of errors) console.error(`FAIL: ${error}`);
  process.exitCode = 1;
} else {
  console.log(
    "Application structure verified. Execute all required checks; structure does not prove coverage.",
  );
}
