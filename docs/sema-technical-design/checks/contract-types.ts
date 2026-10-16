// Compiler-only negative cases. Do not import this file into application handlers.
import type { DataModelFromSchemaDefinition } from "convex/server";
import type { Infer } from "convex/values";
import schema from "../convex/schema";
import { publicContracts } from "../contracts/public";

type Model = DataModelFromSchemaDefinition<typeof schema>;
type Tables = keyof Model;
const knownTable: Tables = "organizations";
// @ts-expect-error The application data model must reject unknown tables.
const unknownTable: Tables = "unscoped_generic_entities";

type VisitorView = Infer<
  (typeof publicContracts)["visitor.watchConversation"]["returns"]
>;
type VisitorMessage = VisitorView["messages"][number];
type NotesArePrivate = VisitorMessage["text"];
// @ts-expect-error Visitor messages must not carry internal notes.
type ForbiddenNotes = VisitorMessage["notes"];
// @ts-expect-error Visitor results must not expose the billing account.
type ForbiddenBilling = VisitorView["billingAccountId"];

type SendTurn = Infer<(typeof publicContracts)["visitor.sendTurn"]["args"]>;
// @ts-expect-error The visitor cannot set their own staff role.
type ForbiddenRole = SendTurn["role"];

type Membership = Model["memberships"]["document"];
const ownerRole: Membership["role"] = "owner";
// @ts-expect-error A workspace cannot assign a platform operator role.
const operatorRole: Membership["role"] = "operator";

void knownTable;
void unknownTable;
void ownerRole;
void operatorRole;
export type CompileOnlyEvidence = NotesArePrivate;
