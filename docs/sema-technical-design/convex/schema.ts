// Sema technical design v1.0 — application-owned physical schema.
// No authorization, uniqueness, business bounds or deployment is implied by schema validation.
// Component-managed auth/workflow tables are intentionally excluded.
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { EMBEDDING_DIMENSIONS } from "./constants";

const language = v.union(v.literal("en"), v.literal("sw"));
const languageOrMixed = v.union(
  v.literal("en"),
  v.literal("sw"),
  v.literal("mixed"),
  v.literal("unknown"),
);
const providerEnvironment = v.union(v.literal("sandbox"), v.literal("live"));
const conversationMode = v.union(
  v.literal("ai_active"),
  v.literal("waiting_human"),
  v.literal("human_active"),
  v.literal("resolved"),
  v.literal("spam"),
);

export default defineSchema(
  {
    staffProfiles: defineTable({
      authUserId: v.string(),
      displayName: v.string(),
      language: language,
      status: v.union(v.literal("active"), v.literal("disabled")),
      updatedAt: v.number(),
    }).index("by_auth", ["authUserId"]),

    // Singleton configuration embedded; strict owner/visitor projections.
    organizations: defineTable({
      name: v.string(),
      createdByAuthUserId: v.string(),
      billingAccountId: v.id("billingAccounts"),
      lifecycle: v.union(
        v.literal("preparing"),
        v.literal("live"),
        v.literal("human_grace"),
        v.literal("read_only"),
        v.literal("purging"),
        v.literal("blocked"),
      ),
      dataGeneration: v.number(),
      authorizationRevision: v.number(),
      knowledgeRevision: v.number(),
      activeCorpusId: v.optional(v.id("knowledgeCorpora")),
      publicWidgetKey: v.string(),
      widgetEnabled: v.boolean(),
      configRevision: v.number(),
      settings: v.object({
        displayName: v.string(),
        logoAssetId: v.optional(v.id("assets")),
        primaryColor: v.string(),
        welcomeText: v.object({ en: v.string(), sw: v.string() }),
        supportContact: v.object({
          email: v.optional(v.string()),
          phone: v.optional(v.string()),
          url: v.optional(v.string()),
        }),
        privacyUrl: v.optional(v.string()),
        timezone: v.string(),
        weeklyHours: v.array(
          v.object({
            day: v.number(),
            opensMinute: v.number(),
            closesMinute: v.number(),
          }),
        ),
        holidays: v.array(
          v.object({
            date: v.string(),
            closed: v.boolean(),
            opensMinute: v.optional(v.number()),
            closesMinute: v.optional(v.number()),
          }),
        ),
        retentionDays: v.union(v.literal(30), v.literal(90)),
      }),
      assistanceSettingsDraft: v.optional(
        v.object({
          grantId: v.id("supportGrants"),
          settings: v.object({
            displayName: v.string(),
            logoAssetId: v.optional(v.id("assets")),
            primaryColor: v.string(),
            welcomeText: v.object({ en: v.string(), sw: v.string() }),
            supportContact: v.object({
              email: v.optional(v.string()),
              phone: v.optional(v.string()),
              url: v.optional(v.string()),
            }),
            privacyUrl: v.optional(v.string()),
            timezone: v.string(),
            weeklyHours: v.array(
              v.object({
                day: v.number(),
                opensMinute: v.number(),
                closesMinute: v.number(),
              }),
            ),
            holidays: v.array(
              v.object({
                date: v.string(),
                closed: v.boolean(),
                opensMinute: v.optional(v.number()),
                closesMinute: v.optional(v.number()),
              }),
            ),
            retentionDays: v.union(v.literal(30), v.literal(90)),
          }),
        }),
      ),
      site: v.object({
        primaryOrigin: v.string(),
        approvedOrigins: v.array(v.string()),
        proofs: v.array(
          v.object({
            origin: v.string(),
            method: v.union(v.literal("file"), v.literal("meta")),
            challengeDigest: v.optional(v.string()),
            challengeExpiresAt: v.optional(v.number()),
            verifiedAt: v.optional(v.number()),
          }),
        ),
        readinessDigest: v.optional(v.string()),
        goLiveAt: v.optional(v.number()),
        firstGenuineConversationAt: v.optional(v.number()),
      }),
      lastOwnerActivityAt: v.number(),
      contentPurgeAt: v.optional(v.number()),
      updatedAt: v.number(),
    })
      .index("by_widget", ["publicWidgetKey"])
      .index("by_account", ["billingAccountId"])
      .index("by_lifecycle_purge", ["lifecycle", "contentPurgeAt"]),

    memberships: defineTable({
      organizationId: v.id("organizations"),
      authUserId: v.string(),
      role: v.union(v.literal("owner"), v.literal("agent")),
      status: v.union(v.literal("active"), v.literal("revoked")),
      revision: v.number(),
      presence: v.object({
        availability: v.union(v.literal("available"), v.literal("away")),
        lastHeartbeatAt: v.number(),
        leaseExpiresAt: v.number(),
      }),
      updatedAt: v.number(),
    })
      .index("by_org_user", ["organizationId", "authUserId"])
      .index("by_user_status", ["authUserId", "status"])
      .index("by_org_status", ["organizationId", "status"])
      .index("by_presence_expiry", ["status", "presence.leaseExpiresAt"]),

    invitations: defineTable({
      organizationId: v.id("organizations"),
      recipientEmail: v.optional(v.string()),
      emailDigest: v.string(),
      tokenDigest: v.string(),
      deliveryTokenCiphertext: v.optional(
        v.object({
          keyVersion: v.string(),
          nonce: v.string(),
          ciphertext: v.string(),
        }),
      ),
      role: v.literal("agent"),
      status: v.union(
        v.literal("pending"),
        v.literal("accepted"),
        v.literal("revoked"),
        v.literal("expired"),
      ),
      expiresAt: v.number(),
      invitedByAuthUserId: v.string(),
      acceptedByAuthUserId: v.optional(v.string()),
    })
      .index("by_token", ["tokenDigest"])
      .index("by_org_status", ["organizationId", "status"])
      .index("by_status_expiry", ["status", "expiresAt"]),

    supportGrants: defineTable({
      organizationId: v.id("organizations"),
      operatorAuthUserId: v.string(),
      approvedByAuthUserId: v.string(),
      operations: v.array(
        v.union(
          v.literal("knowledge_draft"),
          v.literal("settings_draft"),
          v.literal("inbox_read"),
          v.literal("privacy_assistance"),
        ),
      ),
      reasonCode: v.string(),
      expiresAt: v.number(),
      revokedAt: v.optional(v.number()),
    })
      .index("by_org_operator", ["organizationId", "operatorAuthUserId"])
      .index("by_expiry", ["expiresAt"]),

    knowledgeSources: defineTable({
      organizationId: v.id("organizations"),
      kind: v.union(
        v.literal("faq"),
        v.literal("txt"),
        v.literal("pdf"),
        v.literal("docx"),
        v.literal("webpage"),
      ),
      title: v.string(),
      status: v.union(
        v.literal("draft"),
        v.literal("published"),
        v.literal("unpublished"),
        v.literal("deletion_pending"),
      ),
      draftVersionId: v.optional(v.id("sourceVersions")),
      publishedVersionId: v.optional(v.id("sourceVersions")),
      deletedAt: v.optional(v.number()),
      updatedAt: v.number(),
    }).index("by_org_status", ["organizationId", "status"]),

    sourceVersions: defineTable({
      organizationId: v.id("organizations"),
      sourceId: v.id("knowledgeSources"),
      version: v.number(),
      checksum: v.optional(v.string()),
      language: v.union(
        v.literal("en"),
        v.literal("sw"),
        v.literal("mixed"),
        v.literal("unknown"),
      ),
      rawAssetId: v.optional(v.id("assets")),
      sourceUrl: v.optional(v.string()),
      state: v.union(
        v.literal("uploaded"),
        v.literal("scanning"),
        v.literal("extracting"),
        v.literal("indexing"),
        v.literal("ready"),
        v.literal("failed"),
        v.literal("deletion_pending"),
      ),
      warnings: v.array(v.string()),
      extractorVersion: v.string(),
      chunkerVersion: v.string(),
      byteCount: v.number(),
      pageCount: v.number(),
      chunkCount: v.number(),
      createdByAuthUserId: v.string(),
      errorCode: v.optional(v.string()),
      purgeAt: v.optional(v.number()),
    })
      .index("by_source_version", ["sourceId", "version"])
      .index("by_org_state", ["organizationId", "state"])
      .index("by_purge", ["purgeAt"]),

    knowledgeChunks: defineTable({
      organizationId: v.id("organizations"),
      sourceId: v.id("knowledgeSources"),
      sourceVersionId: v.id("sourceVersions"),
      ordinal: v.number(),
      text: v.string(),
      page: v.optional(v.number()),
      section: v.optional(v.string()),
      language: languageOrMixed,
      contentHash: v.string(),
      deletionPending: v.boolean(),
    })
      .index("by_version_ordinal", ["sourceVersionId", "ordinal"])
      .index("by_org_version", ["organizationId", "sourceVersionId"]),

    knowledgeCorpora: defineTable({
      organizationId: v.id("organizations"),
      purpose: v.union(
        v.literal("candidate"),
        v.literal("live"),
        v.literal("retired"),
      ),
      state: v.union(
        v.literal("building"),
        v.literal("ready"),
        v.literal("failed"),
        v.literal("retired"),
      ),
      manifest: v.array(
        v.object({
          sourceId: v.id("knowledgeSources"),
          sourceVersionId: v.id("sourceVersions"),
        }),
      ),
      manifestHash: v.string(),
      embeddingVersion: v.string(),
      embeddingDimensions: v.number(),
      pipelineVersion: v.string(),
      baseKnowledgeRevision: v.number(),
      entryCount: v.number(),
      expectedEntryCount: v.number(),
      publication: v.optional(
        v.object({
          approvedByAuthUserId: v.string(),
          publishedAt: v.number(),
          manifestHash: v.string(),
          previewRunIds: v.array(v.id("qualityRuns")),
          previousCorpusId: v.optional(v.id("knowledgeCorpora")),
        }),
      ),
      retireAt: v.optional(v.number()),
    })
      .index("by_org_state", ["organizationId", "state"])
      .index("by_org_purpose", ["organizationId", "purpose"])
      .index("by_retire", ["retireAt"]),

    retrievalEntries: defineTable({
      organizationId: v.id("organizations"),
      corpusId: v.id("knowledgeCorpora"),
      chunkId: v.id("knowledgeChunks"),
      sourceVersionId: v.id("sourceVersions"),
      retrievalScope: v.string(),
      text: v.string(),
      embedding: v.array(v.number()),
      language: languageOrMixed,
    })
      .index("by_corpus_chunk", ["corpusId", "chunkId"])
      .index("by_version", ["sourceVersionId"])
      .index("by_scope", ["retrievalScope"])
      .vectorIndex("by_embedding", {
        vectorField: "embedding",
        dimensions: EMBEDDING_DIMENSIONS,
        filterFields: ["retrievalScope"],
      })
      .searchIndex("by_text", {
        searchField: "text",
        filterFields: ["retrievalScope"],
      }),

    qualityRuns: defineTable({
      kind: v.union(
        v.literal("owner_preview"),
        v.literal("release_evaluation"),
      ),
      organizationId: v.optional(v.id("organizations")),
      corpusId: v.optional(v.id("knowledgeCorpora")),
      manifestHash: v.optional(v.string()),
      actorAuthUserId: v.string(),
      language: v.optional(language),
      datasetVersion: v.optional(v.string()),
      pipelineVersion: v.string(),
      status: v.union(
        v.literal("queued"),
        v.literal("running"),
        v.literal("passed"),
        v.literal("failed"),
      ),
      scores: v.array(
        v.object({
          metric: v.string(),
          numerator: v.number(),
          denominator: v.number(),
          language: v.optional(language),
          category: v.optional(v.string()),
        }),
      ),
      reviewerReferences: v.array(v.string()),
      artifactAssetId: v.optional(v.id("assets")),
      completedAt: v.optional(v.number()),
      expiresAt: v.optional(v.number()),
    })
      .index("by_org_corpus", ["organizationId", "corpusId"])
      .index("by_kind_pipeline", ["kind", "pipelineVersion"])
      .index("by_expiry", ["expiresAt"]),

    visitorSessions: defineTable({
      organizationId: v.id("organizations"),
      conversationId: v.id("conversations"),
      tokenDigest: v.string(),
      origin: v.string(),
      expiresAt: v.number(),
      revokedAt: v.optional(v.number()),
      language: language,
      noticeVersion: v.string(),
      authorizationRevision: v.number(),
    })
      .index("by_token", ["tokenDigest"])
      .index("by_conversation", ["conversationId"])
      .index("by_expiry", ["expiresAt"]),

    conversations: defineTable({
      organizationId: v.id("organizations"),
      mode: conversationMode,
      modeRevision: v.number(),
      contentRevision: v.number(),
      assignedMembershipId: v.optional(v.id("memberships")),
      lastSequence: v.number(),
      visitorTurnCount: v.number(),
      lastActivityAt: v.number(),
      expiresAt: v.number(),
      contact: v.optional(
        v.object({
          name: v.optional(v.string()),
          email: v.optional(v.string()),
          phoneE164: v.optional(v.string()),
          purpose: v.literal("support_follow_up"),
          noticeVersion: v.string(),
          permissionAt: v.number(),
        }),
      ),
      outcome: v.union(
        v.literal("open"),
        v.literal("visitor_confirmed"),
        v.literal("agent_resolved"),
        v.literal("unconfirmed_closure"),
      ),
      generation: v.number(),
    })
      .index("by_org_mode_activity", [
        "organizationId",
        "mode",
        "lastActivityAt",
      ])
      .index("by_org_assignee", [
        "organizationId",
        "assignedMembershipId",
        "lastActivityAt",
      ])
      .index("by_expiry", ["expiresAt"]),

    messages: defineTable({
      organizationId: v.id("organizations"),
      conversationId: v.id("conversations"),
      sequence: v.number(),
      authorKind: v.union(
        v.literal("visitor"),
        v.literal("ai"),
        v.literal("human"),
        v.literal("system"),
      ),
      authorMembershipId: v.optional(v.id("memberships")),
      language: language,
      body: v.string(),
      kind: v.union(
        v.literal("question"),
        v.literal("answer"),
        v.literal("clarification"),
        v.literal("fallback"),
        v.literal("notice"),
        v.literal("human_reply"),
      ),
      clientCommandId: v.optional(v.string()),
      payloadHash: v.optional(v.string()),
      replyToTurnId: v.optional(v.id("turns")),
      answerRunId: v.optional(v.id("answerRuns")),
      redactedAt: v.optional(v.number()),
    })
      .index("by_conversation_sequence", ["conversationId", "sequence"])
      .index("by_conversation_command", ["conversationId", "clientCommandId"])
      .index("by_turn", ["replyToTurnId"]),

    turns: defineTable({
      organizationId: v.id("organizations"),
      conversationId: v.id("conversations"),
      visitorSessionId: v.id("visitorSessions"),
      clientTurnId: v.string(),
      payloadHash: v.string(),
      visitorMessageId: v.id("messages"),
      acceptedAt: v.number(),
      answerDeadlineAt: v.number(),
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
      modeRevisionAtAccept: v.number(),
      dataGeneration: v.number(),
      reservationStatus: v.union(
        v.literal("none"),
        v.literal("active"),
        v.literal("consumed"),
        v.literal("released"),
      ),
      reservation: v.optional(
        v.object({
          bucketId: v.id("allowanceBuckets"),
          servicePeriodId: v.optional(v.id("servicePeriods")),
          pilotAccountId: v.optional(v.id("billingAccounts")),
          bindingGeneration: v.number(),
          expiresAt: v.number(),
          modeRevision: v.number(),
          knowledgeRevision: v.number(),
        }),
      ),
      leaseExpiresAt: v.optional(v.number()),
      terminalAt: v.optional(v.number()),
    })
      .index("by_conversation_client", ["conversationId", "clientTurnId"])
      .index("by_org_outcome", ["organizationId", "outcome"])
      .index("by_reservation_expiry", ["reservationStatus", "leaseExpiresAt"])
      .index("by_conversation_outcome", ["conversationId", "outcome"]),

    answerRuns: defineTable({
      organizationId: v.id("organizations"),
      turnId: v.id("turns"),
      attemptNumber: v.number(),
      state: v.union(
        v.literal("running"),
        v.literal("validated"),
        v.literal("committed"),
        v.literal("discarded"),
        v.literal("failed"),
      ),
      corpusId: v.id("knowledgeCorpora"),
      pipelineVersion: v.string(),
      modelVersion: v.string(),
      promptVersion: v.string(),
      embeddingVersion: v.string(),
      sourceVersionIds: v.array(v.id("sourceVersions")),
      decisionReason: v.optional(v.string()),
      validationPassed: v.optional(v.boolean()),
      inputTokens: v.number(),
      outputTokens: v.number(),
      latencyMs: v.optional(v.number()),
      providerUsageUnits: v.optional(v.number()),
      costPricingVersion: v.optional(v.string()),
      startedAt: v.number(),
      completedAt: v.optional(v.number()),
    })
      .index("by_turn_attempt", ["turnId", "attemptNumber"])
      .index("by_org", ["organizationId"]),

    messageEvidence: defineTable({
      organizationId: v.id("organizations"),
      conversationId: v.id("conversations"),
      messageId: v.id("messages"),
      sourceVersionId: v.id("sourceVersions"),
      chunkId: v.id("knowledgeChunks"),
      corpusId: v.id("knowledgeCorpora"),
      ordinal: v.number(),
      excerpt: v.string(),
      title: v.string(),
      page: v.optional(v.number()),
      section: v.optional(v.string()),
      safeUrl: v.optional(v.string()),
    })
      .index("by_message", ["messageId"])
      .index("by_version", ["sourceVersionId"])
      .index("by_conversation", ["conversationId"]),

    conversationNotes: defineTable({
      organizationId: v.id("organizations"),
      conversationId: v.id("conversations"),
      authorMembershipId: v.id("memberships"),
      body: v.string(),
      revision: v.number(),
      updatedAt: v.number(),
    }).index("by_conversation", ["conversationId"]),

    feedback: defineTable({
      organizationId: v.id("organizations"),
      conversationId: v.id("conversations"),
      messageId: v.optional(v.id("messages")),
      requestId: v.string(),
      rating: v.union(
        v.literal("helpful"),
        v.literal("unhelpful"),
        v.literal("resolved"),
      ),
      comment: v.optional(v.string()),
    })
      .index("by_conversation", ["conversationId"])
      .index("by_conversation_request", ["conversationId", "requestId"]),

    knowledgeGaps: defineTable({
      organizationId: v.id("organizations"),
      conversationId: v.id("conversations"),
      turnId: v.id("turns"),
      reasonCode: v.string(),
      topicCode: v.optional(v.string()),
      status: v.union(
        v.literal("open"),
        v.literal("drafted"),
        v.literal("resolved"),
        v.literal("dismissed"),
      ),
      proposedSourceId: v.optional(v.id("knowledgeSources")),
    })
      .index("by_org_status", ["organizationId", "status"])
      .index("by_conversation", ["conversationId"])
      .index("by_turn", ["turnId"]),

    billingAccounts: defineTable({
      businessIdentityDigest: v.optional(v.string()),
      verifiedOwnerAuthUserId: v.string(),
      status: v.union(
        v.literal("open"),
        v.literal("inactive"),
        v.literal("erasure_review"),
        v.literal("closed"),
      ),
      activeBinding: v.optional(
        v.object({
          organizationId: v.id("organizations"),
          generation: v.number(),
          verifiedOwnerAuthUserId: v.string(),
          boundAt: v.number(),
        }),
      ),
      bindingGeneration: v.number(),
      pilot: v.optional(
        v.object({
          offerId: v.id("offers"),
          organizationKey: v.string(),
          acceptedAt: v.number(),
          goLiveAt: v.number(),
          endAt: v.number(),
          status: v.union(
            v.literal("active"),
            v.literal("expired"),
            v.literal("converted"),
          ),
          readinessDigest: v.string(),
          conversionPaymentId: v.optional(v.id("providerPayments")),
        }),
      ),
      financialRetainUntil: v.optional(v.number()),
      creditRetainUntil: v.optional(v.number()),
      updatedAt: v.number(),
    })
      .index("by_business_digest", ["businessIdentityDigest"])
      .index("by_owner", ["verifiedOwnerAuthUserId"])
      .index("by_active_org", ["activeBinding.organizationId"])
      .index("by_credit_retention", ["creditRetainUntil"]),

    offers: defineTable({
      key: v.string(),
      kind: v.union(
        v.literal("pilot"),
        v.literal("starter"),
        v.literal("topup"),
      ),
      currency: v.literal("KES"),
      baseMinor: v.number(),
      units: v.number(),
      lifetime: v.union(
        v.literal("pilot_30_days"),
        v.literal("calendar_month"),
        v.literal("pack_90_days"),
      ),
      staffSeats: v.number(),
      maxSources: v.number(),
      maxRawBytes: v.number(),
      maxChunks: v.number(),
      termsVersion: v.string(),
      createdByOperatorSubject: v.string(),
    }).index("by_key", ["key"]),

    purchases: defineTable({
      billingAccountId: v.id("billingAccounts"),
      organizationKey: v.string(),
      offerId: v.id("offers"),
      requestId: v.string(),
      payloadHash: v.string(),
      currency: v.literal("KES"),
      amounts: v.object({
        baseMinor: v.number(),
        taxMinor: v.number(),
        processingFeeMinor: v.number(),
        totalMinor: v.number(),
        taxRuleVersion: v.string(),
        feeRuleVersion: v.string(),
      }),
      allocationRule: v.union(
        v.literal("initial_from_verification"),
        v.literal("pilot_conversion_from_verification"),
        v.literal("next_period"),
        v.literal("grace_or_new_anchor"),
        v.literal("topup_from_verification"),
      ),
      expectedStartAt: v.optional(v.number()),
      expectedEndAt: v.optional(v.number()),
      termsVersion: v.string(),
      quoteExpiresAt: v.number(),
      authorizedAt: v.optional(v.number()),
      authorizedByAuthUserId: v.optional(v.string()),
      invoiceNumber: v.optional(v.string()),
      status: v.union(
        v.literal("quoted"),
        v.literal("authorized"),
        v.literal("payment_pending"),
        v.literal("settled"),
        v.literal("expired"),
        v.literal("review"),
      ),
      settledPaymentId: v.optional(v.id("providerPayments")),
    })
      .index("by_account_request", ["billingAccountId", "requestId"])
      .index("by_invoice", ["invoiceNumber"])
      .index("by_account_status", ["billingAccountId", "status"])
      .index("by_quote_expiry", ["quoteExpiresAt"]),

    paymentAttempts: defineTable({
      billingAccountId: v.id("billingAccounts"),
      purchaseId: v.id("purchases"),
      initiationKey: v.string(),
      provider: v.literal("intasend"),
      environment: providerEnvironment,
      providerResourceId: v.optional(v.string()),
      status: v.union(
        v.literal("reserved"),
        v.literal("initiating"),
        v.literal("unknown"),
        v.literal("pending"),
        v.literal("complete"),
        v.literal("failed"),
        v.literal("canceled"),
        v.literal("review"),
      ),
      initiationLeaseUntil: v.optional(v.number()),
      nextCheckAt: v.optional(v.number()),
      payerLastFour: v.optional(v.string()),
      payerPhoneCiphertext: v.optional(
        v.object({
          keyVersion: v.string(),
          nonce: v.string(),
          ciphertext: v.string(),
        }),
      ),
      payerPhoneExpiresAt: v.optional(v.number()),
      startedAt: v.number(),
      updatedAt: v.number(),
    })
      .index("by_purchase_key", ["purchaseId", "initiationKey"])
      .index("by_resource", ["provider", "environment", "providerResourceId"])
      .index("by_status_check", ["status", "nextCheckAt"])
      .index("by_purchase_status", ["purchaseId", "status"]),

    providerPayments: defineTable({
      billingAccountId: v.optional(v.id("billingAccounts")),
      attemptId: v.optional(v.id("paymentAttempts")),
      provider: v.literal("intasend"),
      environment: providerEnvironment,
      resourceId: v.string(),
      status: v.union(
        v.literal("complete"),
        v.literal("reversed"),
        v.literal("refunded"),
        v.literal("review"),
      ),
      verifiedAt: v.number(),
      providerPaidAt: v.optional(v.number()),
      currency: v.string(),
      grossMinor: v.number(),
      providerReference: v.string(),
      merchantDigest: v.string(),
      verificationDigest: v.string(),
      allocation: v.optional(
        v.object({
          purchaseId: v.id("purchases"),
          effectKey: v.string(),
          amountMinor: v.number(),
          allocatedAt: v.number(),
          servicePeriodId: v.optional(v.id("servicePeriods")),
          bucketId: v.optional(v.id("allowanceBuckets")),
        }),
      ),
    })
      .index("by_resource", ["provider", "environment", "resourceId"])
      .index("by_account", ["billingAccountId"])
      .index("by_allocation_effect", ["allocation.effectKey"]),

    servicePeriods: defineTable({
      billingAccountId: v.id("billingAccounts"),
      organizationKey: v.string(),
      bindingGeneration: v.number(),
      offerId: v.id("offers"),
      paymentId: v.id("providerPayments"),
      startAt: v.number(),
      endAt: v.number(),
      anchorDay: v.number(),
      anchorLocalTime: v.string(),
      timezone: v.literal("Africa/Nairobi"),
      includedUnits: v.literal(1000),
      status: v.union(
        v.literal("funded_future"),
        v.literal("active"),
        v.literal("ended"),
        v.literal("review"),
      ),
      cancelAtPeriodEnd: v.boolean(),
    })
      .index("by_payment", ["paymentId"])
      .index("by_account_start", ["billingAccountId", "startAt"])
      .index("by_status_end", ["status", "endAt"]),

    allowanceBuckets: defineTable({
      billingAccountId: v.id("billingAccounts"),
      bindingGeneration: v.number(),
      kind: v.union(
        v.literal("pilot"),
        v.literal("included"),
        v.literal("topup"),
        v.literal("correction"),
      ),
      spendClass: v.union(
        v.literal("pilot"),
        v.literal("included"),
        v.literal("topup"),
      ),
      originKey: v.string(),
      servicePeriodId: v.optional(v.id("servicePeriods")),
      paymentId: v.optional(v.id("providerPayments")),
      unitsGranted: v.number(),
      unitsAdjusted: v.number(),
      unitsUsed: v.number(),
      unitsReserved: v.number(),
      startAt: v.number(),
      endAt: v.number(),
      status: v.union(
        v.literal("available"),
        v.literal("exhausted"),
        v.literal("expired"),
        v.literal("held"),
      ),
      updatedAt: v.number(),
    })
      .index("by_origin", ["originKey"])
      .index("by_account_class_end", [
        "billingAccountId",
        "spendClass",
        "endAt",
      ])
      .index("by_end", ["endAt"]),

    usageLedger: defineTable({
      billingAccountId: v.id("billingAccounts"),
      organizationKey: v.string(),
      bindingGeneration: v.number(),
      bucketId: v.id("allowanceBuckets"),
      effectKey: v.string(),
      turnKey: v.optional(v.string()),
      messageKey: v.optional(v.string()),
      unitsDelta: v.number(),
      reason: v.union(
        v.literal("grant"),
        v.literal("consume"),
        v.literal("correction"),
        v.literal("revocation"),
      ),
      reversesEntryId: v.optional(v.id("usageLedger")),
      occurredAt: v.number(),
      approvedByOperatorSubject: v.optional(v.string()),
    })
      .index("by_effect", ["effectKey"])
      .index("by_bucket", ["bucketId"])
      .index("by_account_time", ["billingAccountId", "occurredAt"])
      .index("by_reversal", ["reversesEntryId"]),

    financialAdjustments: defineTable({
      billingAccountId: v.id("billingAccounts"),
      paymentId: v.optional(v.id("providerPayments")),
      usageEntryId: v.optional(v.id("usageLedger")),
      replacementBucketId: v.optional(v.id("allowanceBuckets")),
      operationKey: v.string(),
      kind: v.union(
        v.literal("refund"),
        v.literal("reversal"),
        v.literal("unallocated_credit"),
        v.literal("unit_correction_review"),
      ),
      amountMinor: v.number(),
      units: v.optional(v.number()),
      reasonCode: v.string(),
      status: v.union(
        v.literal("requested"),
        v.literal("approved"),
        v.literal("processing"),
        v.literal("complete"),
        v.literal("failed"),
        v.literal("review"),
      ),
      approvedByOperatorSubject: v.optional(v.string()),
      providerOperationId: v.optional(v.string()),
      createdAt: v.number(),
      updatedAt: v.number(),
    })
      .index("by_operation", ["operationKey"])
      .index("by_account_status", ["billingAccountId", "status"]),

    platformControls: defineTable({
      key: v.string(),
      revision: v.number(),
      payload: v.union(
        v.object({
          kind: v.literal("enrollment"),
          open: v.boolean(),
          offerId: v.id("offers"),
        }),
        v.object({
          kind: v.literal("checkout"),
          stage: v.union(
            v.literal("disabled"),
            v.literal("controlled_pilot_conversions"),
            v.literal("broad_paid"),
          ),
        }),
        v.object({
          kind: v.literal("hold"),
          scope: v.union(
            v.literal("global"),
            v.literal("workspace"),
            v.literal("billing_account"),
          ),
          scopeKey: v.string(),
          blockAI: v.boolean(),
          blockVisitorWrites: v.boolean(),
          blockPreparation: v.boolean(),
          blockCheckout: v.boolean(),
          reasonCode: v.string(),
        }),
        v.object({
          kind: v.literal("capacity"),
          maxGlobalGenerations: v.number(),
          maxWorkspaceGenerations: v.number(),
          freeOnly: v.literal(true),
        }),
      ),
      changedByOperatorSubject: v.string(),
      updatedAt: v.number(),
    }).index("by_key", ["key"]),

    resourceBudgets: defineTable({
      resource: v.union(
        v.literal("raw_bytes"),
        v.literal("index_bytes"),
        v.literal("ai_neurons"),
        v.literal("preview_calls"),
        v.literal("generation_slots"),
        v.literal("email_sends"),
      ),
      scopeKey: v.string(),
      windowStartAt: v.number(),
      resetAt: v.number(),
      limit: v.number(),
      committed: v.number(),
      reserved: v.number(),
      headroom: v.number(),
      updatedAt: v.number(),
    })
      .index("by_scope_window", ["resource", "scopeKey", "windowStartAt"])
      .index("by_reset", ["resetAt"]),

    resourceReservations: defineTable({
      organizationId: v.optional(v.id("organizations")),
      operationKey: v.string(),
      ownerKind: v.union(
        v.literal("turn"),
        v.literal("job"),
        v.literal("asset"),
      ),
      ownerKey: v.string(),
      holds: v.array(
        v.object({ budgetId: v.id("resourceBudgets"), units: v.number() }),
      ),
      status: v.union(
        v.literal("active"),
        v.literal("committed"),
        v.literal("released"),
      ),
      expiresAt: v.number(),
    })
      .index("by_operation", ["operationKey"])
      .index("by_status_expiry", ["status", "expiresAt"])
      .index("by_org", ["organizationId"]),

    assets: defineTable({
      organizationId: v.optional(v.id("organizations")),
      parentKind: v.union(
        v.literal("source_version"),
        v.literal("logo"),
        v.literal("export"),
        v.literal("evaluation"),
      ),
      parentKey: v.string(),
      storageId: v.optional(v.id("_storage")),
      kind: v.union(
        v.literal("raw"),
        v.literal("logo"),
        v.literal("export"),
        v.literal("evaluation"),
      ),
      state: v.union(
        v.literal("reserved"),
        v.literal("quarantined"),
        v.literal("approved"),
        v.literal("deletion_pending"),
        v.literal("deleted"),
      ),
      byteCount: v.number(),
      checksum: v.optional(v.string()),
      mimeType: v.optional(v.string()),
      scanVersion: v.optional(v.string()),
      expiresAt: v.optional(v.number()),
      deletedAt: v.optional(v.number()),
      dataGeneration: v.optional(v.number()),
    })
      .index("by_org_kind", ["organizationId", "kind"])
      .index("by_parent", ["parentKind", "parentKey"])
      .index("by_expiry", ["expiresAt"]),

    jobs: defineTable({
      organizationId: v.optional(v.id("organizations")),
      billingAccountId: v.optional(v.id("billingAccounts")),
      dataGeneration: v.optional(v.number()),
      effectKey: v.string(),
      payload: v.union(
        v.object({
          kind: v.literal("ingest"),
          sourceVersionId: v.id("sourceVersions"),
        }),
        v.object({
          kind: v.literal("build_corpus"),
          corpusId: v.id("knowledgeCorpora"),
        }),
        v.object({ kind: v.literal("answer"), turnId: v.id("turns") }),
        v.object({
          kind: v.literal("payment_initiate"),
          attemptId: v.id("paymentAttempts"),
        }),
        v.object({
          kind: v.literal("payment_verify"),
          provider: v.literal("intasend"),
          environment: providerEnvironment,
          resourceId: v.string(),
          callbackDigest: v.optional(v.string()),
        }),
        v.object({
          kind: v.literal("notify"),
          template: v.union(
            v.literal("handoff"),
            v.literal("receipt"),
            v.literal("renewal"),
            v.literal("privacy"),
            v.literal("expiry"),
            v.literal("invitation"),
          ),
          objectKey: v.string(),
          recipientKey: v.string(),
        }),
        v.object({
          kind: v.literal("privacy"),
          requestId: v.id("privacyRequests"),
        }),
        v.object({
          kind: v.literal("deadline"),
          entityKind: v.union(
            v.literal("session"),
            v.literal("membership"),
            v.literal("organization"),
            v.literal("bucket"),
            v.literal("turn"),
            v.literal("support_grant"),
            v.literal("invitation"),
            v.literal("asset"),
            v.literal("payment_input"),
          ),
          entityKey: v.string(),
          expectedRevision: v.optional(v.number()),
        }),
        v.object({
          kind: v.literal("reconcile"),
          scope: v.union(
            v.literal("payments"),
            v.literal("usage"),
            v.literal("resources"),
            v.literal("retention"),
          ),
          scopeKey: v.string(),
        }),
      ),
      state: v.union(
        v.literal("queued"),
        v.literal("leased"),
        v.literal("retry"),
        v.literal("complete"),
        v.literal("canceled"),
        v.literal("dead_letter"),
      ),
      checkpointCursor: v.optional(v.string()),
      attempts: v.number(),
      leaseExpiresAt: v.optional(v.number()),
      nextRunAt: v.number(),
      lastErrorCode: v.optional(v.string()),
      expiresAt: v.optional(v.number()),
    })
      .index("by_effect", ["effectKey"])
      .index("by_state_next", ["state", "nextRunAt"])
      .index("by_org", ["organizationId"])
      .index("by_expiry", ["expiresAt"]),

    auditEvents: defineTable({
      organizationId: v.optional(v.id("organizations")),
      billingAccountId: v.optional(v.id("billingAccounts")),
      conversationId: v.optional(v.id("conversations")),
      eventId: v.string(),
      kind: v.string(),
      actorKind: v.union(
        v.literal("staff"),
        v.literal("operator"),
        v.literal("visitor"),
        v.literal("system"),
      ),
      actorKey: v.optional(v.string()),
      objectKey: v.string(),
      reasonCode: v.string(),
      supportGrantId: v.optional(v.id("supportGrants")),
      retainUntil: v.number(),
      occurredAt: v.number(),
    })
      .index("by_event", ["eventId"])
      .index("by_org_time", ["organizationId", "occurredAt"])
      .index("by_conversation", ["conversationId"])
      .index("by_retention", ["retainUntil"]),

    privacyRequests: defineTable({
      organizationId: v.optional(v.id("organizations")),
      billingAccountId: v.optional(v.id("billingAccounts")),
      requestId: v.string(),
      kind: v.union(
        v.literal("export"),
        v.literal("erase_conversation"),
        v.literal("erase_source"),
        v.literal("erase_workspace"),
        v.literal("retention_update"),
      ),
      targetKey: v.string(),
      authorityReference: v.string(),
      status: v.union(
        v.literal("requested"),
        v.literal("verified"),
        v.literal("running"),
        v.literal("complete"),
        v.literal("review"),
        v.literal("failed"),
      ),
      dueAt: v.number(),
      checkpointCursor: v.optional(v.string()),
      exportAssetId: v.optional(v.id("assets")),
      legalExceptionCode: v.optional(v.string()),
      createdAt: v.number(),
      completedAt: v.optional(v.number()),
    })
      .index("by_request", ["requestId"])
      .index("by_org_status", ["organizationId", "status"])
      .index("by_status_due", ["status", "dueAt"]),

    deletionTombstones: defineTable({
      entityKind: v.union(
        v.literal("organization"),
        v.literal("conversation"),
        v.literal("source"),
        v.literal("source_version"),
        v.literal("session"),
        v.literal("auth_binding"),
      ),
      entityKey: v.string(),
      organizationKey: v.optional(v.string()),
      generation: v.number(),
      reasonCode: v.string(),
      createdAt: v.number(),
      retainUntil: v.number(),
      journalReceiptDigest: v.optional(v.string()),
    })
      .index("by_entity", ["entityKind", "entityKey"])
      .index("by_org", ["organizationKey"])
      .index("by_retention", ["retainUntil"]),

    analyticsEvents: defineTable({
      organizationId: v.id("organizations"),
      eventId: v.string(),
      schemaVersion: v.number(),
      kind: v.string(),
      objectKey: v.string(),
      reasonCode: v.optional(v.string()),
      language: v.optional(language),
      isTest: v.boolean(),
      occurredAt: v.number(),
      expiresAt: v.number(),
      processedAt: v.optional(v.number()),
    })
      .index("by_event", ["eventId"])
      .index("by_org_time", ["organizationId", "occurredAt"])
      .index("by_expiry", ["expiresAt"]),

    metricRollups: defineTable({
      organizationId: v.id("organizations"),
      bucketStartAt: v.number(),
      metricVersion: v.string(),
      counts: v.object({
        visitorConversations: v.number(),
        answers: v.number(),
        fallbacks: v.number(),
        handoffs: v.number(),
        visitorConfirmedResolutions: v.number(),
        ratingsHelpful: v.number(),
        ratingsTotal: v.number(),
      }),
      lastUpdatedAt: v.number(),
    }).index("by_org_bucket", [
      "organizationId",
      "bucketStartAt",
      "metricVersion",
    ]),

    // Technical receipt for nonfinancial command replay; authorization is rechecked before returning a reference.
    commandReceipts: defineTable({
      organizationId: v.optional(v.id("organizations")),
      actorKey: v.string(),
      command: v.string(),
      requestId: v.string(),
      payloadHash: v.string(),
      result: v.union(
        v.object({
          kind: v.literal("organization"),
          id: v.id("organizations"),
        }),
        v.object({ kind: v.literal("membership"), id: v.id("memberships") }),
        v.object({
          kind: v.literal("source_version"),
          id: v.id("sourceVersions"),
        }),
        v.object({ kind: v.literal("corpus"), id: v.id("knowledgeCorpora") }),
        v.object({ kind: v.literal("message"), id: v.id("messages") }),
        v.object({
          kind: v.literal("privacy_request"),
          id: v.id("privacyRequests"),
        }),
        v.object({ kind: v.literal("none") }),
      ),
      createdAt: v.number(),
      expiresAt: v.number(),
    })
      .index("by_actor_command", ["actorKey", "command", "requestId"])
      .index("by_org", ["organizationId"])
      .index("by_expiry", ["expiresAt"]),
  },
  { schemaValidation: true, strictTableNameTypes: true },
);
