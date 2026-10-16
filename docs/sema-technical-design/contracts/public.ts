// Design contracts only: these validators do not register functions or enforce authorization.
// Handlers must implement the access/reauthentication policies in the technical design.
import { v } from "convex/values";

const language = v.union(v.literal("en"), v.literal("sw"));
const organizationId = v.id("organizations");
const conversationId = v.id("conversations");
const requestId = v.string();
const mode = v.union(
  v.literal("ai_active"),
  v.literal("waiting_human"),
  v.literal("human_active"),
  v.literal("resolved"),
  v.literal("spam"),
);
const evidence = v.union(
  v.object({
    state: v.literal("available"),
    evidenceId: v.id("messageEvidence"),
    title: v.string(),
    excerpt: v.string(),
    page: v.optional(v.number()),
    section: v.optional(v.string()),
    safeUrl: v.optional(v.string()),
  }),
  v.object({ state: v.literal("removed") }),
);
const visitorMessage = v.object({
  id: v.id("messages"),
  sequence: v.number(),
  authorKind: v.union(
    v.literal("visitor"),
    v.literal("ai"),
    v.literal("human"),
    v.literal("system"),
  ),
  kind: v.union(
    v.literal("question"),
    v.literal("answer"),
    v.literal("clarification"),
    v.literal("fallback"),
    v.literal("notice"),
    v.literal("human_reply"),
  ),
  language,
  text: v.string(),
  redacted: v.boolean(),
  sources: v.array(evidence),
});
const accepted = v.object({ accepted: v.literal(true), requestId });
const amount = v.object({
  currency: v.literal("KES"),
  baseMinor: v.number(),
  taxMinor: v.number(),
  processingFeeMinor: v.number(),
  totalMinor: v.number(),
});
const access = v.object({
  canPrepare: v.boolean(),
  canPreview: v.boolean(),
  canPublish: v.boolean(),
  canReadHistory: v.boolean(),
  canExport: v.boolean(),
  canAcceptVisitorMessage: v.boolean(),
  canHumanReply: v.boolean(),
  canAttemptLiveAI: v.boolean(),
  canBuyTopup: v.boolean(),
  reasonCode: v.string(),
  effectiveUntil: v.optional(v.number()),
  policyRevision: v.number(),
});

export const publicContracts = {
  "workspaces.create": {
    transport: "mutation",
    auth: "verified_staff",
    args: v.object({
      requestId,
      name: v.string(),
      eligibilityDeclarationVersion: v.string(),
      noticeVersion: v.string(),
    }),
    returns: v.object({ organizationId, state: v.literal("preparing") }),
  },
  "members.invite": {
    transport: "action",
    auth: "owner_reauthenticated",
    args: v.object({
      organizationId,
      requestId,
      email: v.string(),
      expectedAuthorizationRevision: v.number(),
    }),
    returns: v.object({
      invitationId: v.id("invitations"),
      expiresAt: v.number(),
    }),
  },
  "members.remove": {
    transport: "mutation",
    auth: "owner_reauthenticated",
    args: v.object({
      organizationId,
      requestId,
      membershipId: v.id("memberships"),
      expectedAuthorizationRevision: v.number(),
    }),
    returns: accepted,
  },
  "knowledge.requestImport": {
    transport: "mutation",
    auth: "owner_or_scoped_support",
    args: v.object({
      organizationId,
      requestId,
      sourceId: v.optional(v.id("knowledgeSources")),
      title: v.string(),
      input: v.union(
        v.object({
          kind: v.literal("file"),
          declaredType: v.union(
            v.literal("txt"),
            v.literal("pdf"),
            v.literal("docx"),
          ),
          declaredBytes: v.number(),
        }),
        v.object({ kind: v.literal("webpage"), url: v.string() }),
        v.object({
          kind: v.literal("faq"),
          question: v.string(),
          answer: v.string(),
          language,
        }),
      ),
    }),
    returns: v.object({
      sourceVersionId: v.id("sourceVersions"),
      state: v.literal("draft"),
      assetId: v.optional(v.id("assets")),
    }),
  },
  "knowledge.preview": {
    transport: "mutation",
    auth: "owner",
    args: v.object({
      organizationId,
      requestId,
      corpusId: v.id("knowledgeCorpora"),
      manifestHash: v.string(),
      language,
      question: v.string(),
    }),
    returns: v.object({
      qualityRunId: v.id("qualityRuns"),
      status: v.literal("queued"),
    }),
  },
  "knowledge.publish": {
    transport: "mutation",
    auth: "owner",
    args: v.object({
      organizationId,
      requestId,
      corpusId: v.id("knowledgeCorpora"),
      manifestHash: v.string(),
      expectedKnowledgeRevision: v.number(),
      previewRunIds: v.array(v.id("qualityRuns")),
    }),
    returns: v.object({
      corpusId: v.id("knowledgeCorpora"),
      knowledgeRevision: v.number(),
      publishedAt: v.number(),
    }),
  },
  "activation.check": {
    transport: "query",
    auth: "owner",
    args: v.object({ organizationId }),
    returns: v.object({
      ready: v.boolean(),
      missingChecks: v.array(v.string()),
      offer: v.union(
        v.literal("pilot"),
        v.literal("starter"),
        v.literal("not_yet_available"),
      ),
      readinessDigest: v.string(),
      access,
    }),
  },
  "activation.confirm": {
    transport: "mutation",
    auth: "owner",
    args: v.object({
      organizationId,
      requestId,
      readinessDigest: v.string(),
      acceptedOfferKey: v.string(),
      siteHandshakeId: v.string(),
    }),
    returns: v.union(
      v.object({
        status: v.literal("pilot_active"),
        goLiveAt: v.number(),
        endAt: v.number(),
        includedAnswers: v.literal(100),
      }),
      v.object({
        status: v.literal("paid_active"),
        servicePeriodId: v.id("servicePeriods"),
        endAt: v.number(),
      }),
      v.object({ status: v.literal("payment_required") }),
    ),
  },
  "widget.bootstrap": {
    transport: "http_action",
    auth: "public_origin_and_abuse_checks",
    args: v.object({
      publicWidgetKey: v.string(),
      language,
      noticeVersion: v.string(),
    }),
    returns: v.union(
      v.object({
        status: v.literal("session_created"),
        conversationId,
        visitorToken: v.string(),
        expiresAt: v.number(),
        displayName: v.string(),
        poweredBy: v.literal("Sema"),
      }),
      v.object({
        status: v.literal("static_contact"),
        contactLabel: v.string(),
        safeContactUrl: v.optional(v.string()),
        reasonCode: v.string(),
      }),
    ),
  },
  "visitor.sendTurn": {
    transport: "mutation",
    auth: "visitor_token",
    args: v.object({
      visitorToken: v.string(),
      conversationId,
      clientTurnId: v.string(),
      text: v.string(),
      language,
    }),
    returns: v.object({
      turnId: v.id("turns"),
      visitorMessageId: v.id("messages"),
      outcome: v.union(
        v.literal("queued"),
        v.literal("running"),
        v.literal("answered"),
        v.literal("clarified"),
        v.literal("fallback"),
        v.literal("human_routed"),
        v.literal("canceled"),
        v.literal("failed"),
      ),
      resultMessageId: v.optional(v.id("messages")),
    }),
  },
  "visitor.watchConversation": {
    transport: "query",
    auth: "visitor_token",
    args: v.object({
      visitorToken: v.string(),
      conversationId,
      afterSequence: v.number(),
      limit: v.number(),
      expectedContentRevision: v.optional(v.number()),
    }),
    returns: v.object({
      mode,
      contentRevision: v.number(),
      resetRequired: v.boolean(),
      messages: v.array(visitorMessage),
      lastSequence: v.number(),
      hasMore: v.boolean(),
      expiresAt: v.number(),
    }),
  },
  "visitor.requestHandoff": {
    transport: "mutation",
    auth: "visitor_token",
    args: v.object({ visitorToken: v.string(), conversationId, requestId }),
    returns: v.object({
      mode: v.union(v.literal("waiting_human"), v.literal("human_active")),
      liveAvailable: v.boolean(),
      modeRevision: v.number(),
    }),
  },
  "inbox.claim": {
    transport: "mutation",
    auth: "staff_member",
    args: v.object({
      organizationId,
      conversationId,
      requestId,
      expectedModeRevision: v.number(),
    }),
    returns: v.object({
      assignedMembershipId: v.id("memberships"),
      modeRevision: v.number(),
    }),
  },
  "inbox.reply": {
    transport: "mutation",
    auth: "assigned_staff_member",
    args: v.object({
      organizationId,
      conversationId,
      requestId,
      expectedModeRevision: v.number(),
      text: v.string(),
      language,
    }),
    returns: v.object({
      messageId: v.id("messages"),
      sequence: v.number(),
      persisted: v.literal(true),
    }),
  },
  "inbox.resume": {
    transport: "mutation",
    auth: "staff_member",
    args: v.object({
      organizationId,
      conversationId,
      requestId,
      expectedModeRevision: v.number(),
    }),
    returns: v.object({
      mode: v.literal("ai_active"),
      modeRevision: v.number(),
    }),
  },
  "presence.heartbeat": {
    transport: "mutation",
    auth: "staff_member",
    args: v.object({
      organizationId,
      availability: v.union(v.literal("available"), v.literal("away")),
    }),
    returns: v.object({ leaseExpiresAt: v.number() }),
  },
  "billing.quote": {
    transport: "mutation",
    auth: "owner_reauthenticated",
    args: v.object({ organizationId, requestId, offerKey: v.string() }),
    returns: v.object({
      purchaseId: v.id("purchases"),
      amount,
      quoteExpiresAt: v.number(),
      periodRule: v.string(),
      termsVersion: v.string(),
      units: v.number(),
    }),
  },
  "billing.authorize": {
    transport: "mutation",
    auth: "owner_reauthenticated",
    args: v.object({
      organizationId,
      purchaseId: v.id("purchases"),
      requestId,
      acceptedTotalMinor: v.number(),
      acceptedTermsVersion: v.string(),
    }),
    returns: v.object({
      purchaseId: v.id("purchases"),
      status: v.literal("authorized"),
    }),
  },
  "billing.requestPayment": {
    transport: "action",
    auth: "owner_reauthenticated",
    args: v.object({
      organizationId,
      purchaseId: v.id("purchases"),
      requestId,
      payerPhone: v.string(),
    }),
    returns: v.object({
      attemptId: v.id("paymentAttempts"),
      status: v.union(v.literal("pending"), v.literal("unknown")),
    }),
  },
  "billing.usage": {
    transport: "query",
    auth: "owner",
    args: v.object({ organizationId }),
    returns: v.object({
      access,
      includedRemaining: v.number(),
      reservedReplies: v.number(),
      topups: v.array(
        v.object({
          bucketId: v.id("allowanceBuckets"),
          remaining: v.number(),
          expiresAt: v.number(),
        }),
      ),
      serviceEndAt: v.optional(v.number()),
    }),
  },
  "privacy.requestExport": {
    transport: "mutation",
    auth: "owner_reauthenticated",
    args: v.object({ organizationId, requestId }),
    returns: v.object({
      privacyRequestId: v.id("privacyRequests"),
      status: v.literal("requested"),
    }),
  },
  "privacy.requestErasure": {
    transport: "mutation",
    auth: "owner_reauthenticated",
    args: v.object({
      organizationId,
      requestId,
      target: v.union(
        v.object({ kind: v.literal("conversation"), id: conversationId }),
        v.object({ kind: v.literal("source"), id: v.id("knowledgeSources") }),
        v.object({ kind: v.literal("workspace") }),
      ),
    }),
    returns: v.object({
      privacyRequestId: v.id("privacyRequests"),
      status: v.literal("requested"),
    }),
  },
} as const;

export type PublicOperation = keyof typeof publicContracts;
