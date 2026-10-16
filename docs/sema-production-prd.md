# Sema — Product Requirements Document

**Product name:** Sema — confirmed by the user  
**Version:** 2.1 — refined product baseline after 30 requirements questions  
**Date:** 15 October 2026 (Africa/Nairobi)  
**Market:** Kenya; service businesses, with a broad mix of service segments in the pilot  
**Accountable owner:** Founder / Product Lead; named assignees required before implementation  
**Status:** Confirmed product requirements and delegated engineering baseline; implementation and release evidence outstanding  
**Source reviewed:** `sema-ai-prd.md`, 544 lines, supplied in the “Finalize SaaS PRD” conversation

**Companion design:** [Data model and system flows v1.0](sema-data-model-and-flows.md), 16 October 2026. This companion details implementation choices without changing the confirmed product terms.

**Technical design:** [Implementation blueprint and physical schema v1.0](sema-technical-design.md), 16 October 2026. Local schema checks are distinct from the product's release evidence gates.

> **Product promise:** Answer routine website questions using a business’s approved knowledge, make uncertainty visible, and hand the conversation to a person. Businesses pay in KES through M-Pesa.
>
> **Confirmed product direction:** Sema replaces the draft's working name, Jenga Support AI. The pilot serves a broad mix of non-regulated service businesses. Launch supports website chat in English and Swahili, approved FAQ answers, live human replies in Sema's inbox and optional contact capture when staff are unavailable. WhatsApp follows later. Immediate self-service setup and activation are available; standard assistance is included afterward on request in Starter at a KES 2,500 monthly base price for 1,000 AI replies, plus applicable tax and disclosed payment-processing fees; businesses maintain their own FAQs afterward. Only the initial public pilot phase offers 30 free days from widget go-live and 100 AI replies per business; later customers pay before go-live. Broad paid launch requires two distinct verified pilot-business Starter conversions plus release evidence. Live data lookup, booking execution and payment initiation by the AI are outside the first release.

## Contents

1. [Decision summary and evidence](#1-decision-summary-and-evidence)
2. [Customers, problem and positioning](#2-customers-problem-and-positioning)
3. [Outcomes and measurement](#3-outcomes-and-measurement)
4. [MVP scope and limits](#4-mvp-scope-and-limits)
5. [Roles and journeys](#5-roles-and-journeys)
6. [Functional requirements and acceptance criteria](#6-functional-requirements-and-acceptance-criteria)
7. [RAG behavior and evaluation](#7-rag-behavior-and-evaluation)
8. [Plans, metering and billing](#8-plans-metering-and-billing)
9. [Architecture and data contracts](#9-architecture-and-data-contracts)
10. [Security and privacy](#10-security-and-privacy)
11. [Nonfunctional requirements](#11-nonfunctional-requirements)
12. [Operations and incident response](#12-operations-and-incident-response)
13. [Validation, rollout and release gates](#13-validation-rollout-and-release-gates)
14. [Risks and mitigations](#14-risks-and-mitigations)
15. [Roadmap and decision register](#15-roadmap-and-decision-register)
16. [Review disposition and sources](#16-review-disposition-and-sources)

## 1. Decision summary and evidence

### 1.1 How to read this PRD

- **Confirmed input (C):** Explicit user decisions recorded in this revision. Historical draft statements alone are not confirmed product decisions. Confirmation establishes intent, not market truth or an implemented feature.
- **Verified external fact (V):** Supported by the primary documentation linked in §16.2, checked on 15 October 2026. Vendor availability, policies and prices can change.
- **Delegated engineering baseline (P):** A recommended implementation, resource limit, test target or operating default selected under the user's delegation. “Must” defines required behavior in this baseline; it does not claim that behavior is implemented. Routine defaults do not require another product interview; material cost, privacy or scope changes return to the founder.
- **Assumption / hypothesis (A):** An unvalidated customer, commercial, staffing or performance expectation. Numerical plan terms explicitly confirmed by the user are C; engineering targets are P; forecasts and outcome expectations are A. None become measured facts merely by appearing here.
- **Evidence gate / external dependency (O):** Requires documented implementation, vendor, legal or operating evidence by the gate in §15.2. Future expansion choices remain explicitly deferred. A settled product preference does not close an evidence gate.

No interviews, customer analytics, paid-pilot results, cost benchmarks, penetration tests, legal opinions or deployed implementation were supplied. None are claimed as validated here. Acceptance criteria describe future tests; they have not been executed.

### 1.2 Confirmed product and delegated design baseline

| Decision | Status | Rationale / consequence |
|---|---|---|
| Name the product Sema | C — user-confirmed | Product naming is decided. Trademark and domain clearance remain launch tasks. |
| Use Next.js/Netlify with Convex as the primary database, realtime, search, file and workflow backend; retain IntaSend, Workers AI and Resend | C — user-confirmed; P for component details; O for evidence | Supersedes Neon/Drizzle/pgvector/PartyServer/Inngest. No parallel application database. Free terms, auth, isolation, quotas and recovery remain launch checks. |
| Serve service businesses, with a broad mix of service segments in the pilot | C — user-confirmed | Validate segment differences during the pilot rather than selecting a single vertical in advance. |
| Ship website chat first; WhatsApp later | C — user-confirmed; P for readiness gate | WhatsApp is not a launch dependency. |
| Limit launch AI to approved FAQ answers and human handoff | C — user-confirmed | No live lookup or transactional actions in the first release. |
| Starter: KES 2,500 base/month with 1,000 AI replies and standard assisted setup included | C — user-confirmed; P for other plan limits | No separate standard setup fee. Two staff accounts and the KES 500/100-answer, 90-day top-up offer are confirmed; storage limits remain proposed. |
| Run a free initial pilot for 30 days from widget go-live, with 100 AI replies per business | C — user-confirmed | Pilot participation is free; paid subscription begins only after explicit conversion and verified payment. |
| Limit the free offer to the initial public pilot phase; later customers pay before going live | C — user-confirmed | Public registration, bounded imports and preview continue. Closing pilot enrollment preserves existing enrolled businesses' promised periods; no permanent free trial is offered. |
| Require two distinct pilot businesses to make verified Starter payments before broad paid launch, alongside all release evidence gates | C — user-confirmed | Prerequisite safety/billing checks enable controlled conversions first. Two payments are necessary for G5, not a prerequisite for the first controlled conversion, and do not alone establish market fit. |
| Provide immediate self-service imports, AI preview and activation; included standard assistance is available afterward | C — latest user-confirmed revision | No mandatory founder queue or assistance booking before activation. Businesses maintain their own knowledge. |
| Count one completed substantive FAQ answer per visitor message; exclude greetings, clarifications, fallbacks, errors, retries and human replies | C — user-confirmed; P for implementation details | Apply the same counting rule to paid and pilot allowances. Sema absorbs unsuccessful/nonbillable generation costs. |
| After paid allowance exhaustion, pause AI, keep human chat available and offer an explicit prepaid top-up | C — user-confirmed | No automatic charge. Confirmed top-ups: KES 500 for 100 answers, valid for 90 days and usable only during an active paid subscription. |
| Reset included monthly replies without rollover; spend included allowance before earliest-expiring top-up packs | C — user-confirmed | Unexpired top-ups retain their balances and original expiry across renewals. |
| At free-pilot quota exhaustion, pause AI but keep human chat until day 30; permit explicit early Starter conversion | C — user-confirmed | No free-pilot top-ups. |
| Use reminders and owner-authorized monthly M-Pesa renewal at launch | C — user-confirmed | No automatic debit. Provider-specific execution and reconciliation still require proof. |
| Include two named business staff accounts: owner plus one agent | C — user-confirmed | Separate logins; no shared credentials. Larger-team offerings are deferred. |
| Support manual FAQs, TXT, text PDF, DOCX and one public-page import at a time | C — user-confirmed; P for resource/security limits | No scanned-document OCR, whole-site crawl or automatic synchronization at launch. |
| Require owner preview and explicit publication for every new/changed knowledge source | C — user-confirmed | Saving or processing a draft never changes live answers. |
| Allow English or Swahili sources to support grounded answers in either visitor-selected language | C — user-confirmed; P for evaluation thresholds | Duplicate translated sources are not required; bilingual and cross-language quality must pass before launch. |
| Start the pilot with non-regulated services; defer sensitive/regulated sectors | C — user-confirmed | Clinics, schools, financial services and similar sectors are outside the initial pilot, including public-FAQ-only deployments. |
| Provide live human replies through Sema's inbox; advertise availability only when business hours and available signed-in staff agree | C — user-confirmed; P for presence timeout details | Otherwise show away copy, capture optional contact, persist the request and email staff. No promise of an instant human response. |
| Pause AI on service expiry; allow three days of human-chat grace for missed paid renewals, then 30 days of read-only inbox/export | C — user-confirmed | Free pilot stops live service at day 30 and receives 30 days of read/export access; expired widget shows business contact details. |
| Retain conversation content 90 days from last activity, with an owner-selectable 30-day option and earlier deletion controls | C — user-confirmed; V/O for legal/vendor feasibility | Product preference does not close the legal, processor or backup deletion gates. |
| Accept public-safe business knowledge only; prohibit private record lookup | P | Uploaded documents become a visitor-facing information source. Tenant isolation does not make private material safe to disclose to that tenant's anonymous visitors. |
| Support English and Swahili in the first release | C — user-confirmed; P for quality thresholds | Both language slices must pass before customer launch. Guaranteed Sheng coverage remains excluded. |
| Founder personally handles Sema setup/product support by scheduled appointment and best-effort asynchronous help; no fixed daily window | C — user-confirmed | This does not staff businesses' visitor-support inboxes or imply 24/7 Sema coverage. |
| Use free vendor tiers for the pilot; no positive recurring infrastructure budget approved | C — user-confirmed cost preference; V/O for feasibility | Hard quota stops and privacy/recovery limitations must be measured and disclosed. No paid upgrade or billing fallback is authorized. |
| Recommend routine engineering defaults within preferred stack/cost constraints; return material cost/privacy/scope changes to the founder | C — user-confirmed delegation | Engineering selections remain subject to evidence and implementation tests. |
| One business/production website with its own logo/colors and Powered by Sema attribution | C — user-confirmed | www/apex variants count as one; multi-site agencies and full white-labeling are deferred. |
| Open public signup with immediate self-service imports, preview and activation after automated readiness/security checks | C — user-confirmed | No invitation or founder approval. Quotas, owner preview/publication and domain controls still apply; the free clock starts at verified widget go-live. |
| Adopt Convex as the primary backend, replacing the previously accepted Neon/PartyServer baseline | C — user-confirmed, subject to checks | Moving off SQL is intentional. Implementation must preserve all confirmed billing, privacy and handoff invariants. |
| No Kenya-only residency requirement; permit disclosed non-Kenyan processing only after required reviews | C — user-confirmed | Vendor, DPA, transfer, retention and actual location checks remain mandatory; this is not blanket legal authorization. |
| Treat model confidence as a calibrated decision policy | P | Retrieval score or a model's claimed confidence is not a probability that an answer is correct. |

### 1.3 Critical assumptions to test

| ID | Hypothesis | Evidence needed / owner | Decision gate |
|---|---|---|---|
| A01 | Target businesses have sufficient website support traffic | Review 30 days of support volume, channel mix and site visits with 15–25 prospects; Product | Before committing MVP scope |
| A02 | Free-pilot businesses will convert to Starter at the confirmed KES 2,500/month price | Share the paid terms before pilot enrollment; record conversion intent and then actual settled post-pilot subscriptions; Product | Discovery records intent; paid-conversion evidence is assessed at G4/G5 |
| A03 | Customers can supply accurate, public-safe knowledge | 3–5 partners publish a reviewed knowledge set and pass preview questions; Customer Success | Before pilot |
| A04 | English and Swahili cover most pilot questions with acceptable quality | Language sample from partner questions and bilingual evaluation; AI Lead | Both are launch requirements; validate quality before launch |
| A05 | The included allowance is economically viable | Measured full-allowance costs, payment fees and support effort; Finance + Engineering | Before paid launch |
| A06 | Stack regions, terms, auth and payment accounts support this service | Account-specific technical spike, vendor review and transfer assessment; Engineering + Privacy | Before real customer data |
| A07 | Businesses can staff human handoffs | Named agent, published hours and pilot response data; Product | Before enabling each live widget |
| A08 | The team can deliver the gated MVP in roughly 8–12 engineering weeks | Staffing and estimated backlog; Engineering | After validation; schedule remains indicative |

## 2. Customers, problem and positioning

### 2.1 Initial customer profile

**Buyer:** Owner or operations manager of a Kenyan service business with a website and a small support team. **Daily operator:** The owner or a designated agent. **End user:** A website visitor seeking factual information about services, published prices, operating hours, locations, service areas, appointment procedures, cancellation policies or payment instructions.

**Confirmed pilot approach:** Recruit a broad mix of service businesses rather than choosing one vertical now. Candidate segments include salons, gyms, cleaning services, consultancies and agencies purchasing support for their own business; agency management of multiple client workspaces is outside MVP. The individual example segments remain recommendations. The user has confirmed that the initial pilot excludes sensitive/regulated sectors; clinics, schools, financial services and similar sectors must wait for a later readiness assessment. Report pilot outcomes by service segment as well as overall, and use results to choose the strongest subsequent beachhead.

Pilot candidates must have an editable website, a named support contact, approved public information, and enough repetitive questions to evaluate value. Proposed screening guideline: at least 100 routine questions/month across existing channels; capture the website share rather than assuming those questions will move to the widget.

Start with policy and FAQ answers. Live inventory, account balances, personal order status, bookings, refunds and transaction execution require separate authenticated integrations and are out of MVP. A static document is not a live stock or order system.

### 2.2 Problem hypotheses and jobs

The draft hypothesizes that repetitive questions consume staff time, visitors wait after hours, and existing tools feel expensive or difficult. Validate these claims through interviews and observed workflows; competitor pricing alone cannot establish Kenyan demand.

| User | Job | Desired outcome |
|---|---|---|
| Owner | Activate independently, request included assistance when useful, then maintain FAQs | Self-service knowledge preparation, review and installation; median under 30 minutes of active owner effort as a delegated target, with optional assistance time measured separately |
| Visitor | Get an answer without repeating the question | An understandable answer with evidence, or an honest next step |
| Agent | Take over when automation stops helping | Transcript, reason for handoff, contact permission and clear ownership |
| Owner | Know whether the product pays for itself | Auditable usage, quality signals and costs; no invented revenue attribution |

### 2.3 Positioning and boundaries

Sema is a Kenyan-first website support assistant with grounded answers, human takeover, KES pricing and M-Pesa subscription collection. It is not initially a full helpdesk replacement or an autonomous sales, financial or clinical adviser.

Potential differentiation—local onboarding, useful handoffs, reliable policy answers and predictable costs—is a hypothesis to test against global helpdesks, local chatbot products, agencies, generic widgets and the customer's existing WhatsApp/manual workflow. Do not claim competitor weaknesses without comparative evidence. Do not market native WhatsApp support until that channel ships.

**Confirmed sector boundary:** The first pilot accepts non-regulated service businesses only. Clinics, schools, financial services and similar sensitive/regulated sectors are deferred, even if they request public FAQ answers only. Customer Success screens applicants against a documented eligibility checklist and routes ambiguous cases for review rather than silently admitting them. Healthcare records, children's records, SACCO/member data, banking and insurance claims are outside pilot scope. Later admission requires a separate product decision and legal/security/sector readiness assessment; a broad service-business mix does not override this exclusion.

## 3. Outcomes and measurement

### 3.1 Business and customer targets

All targets below are planning hypotheses, not forecasts or validated benchmarks. Report cohort size and numerator/denominator beside every percentage; avoid drawing retention conclusions from very small cohorts.

| Metric | Definition | Proposed target / observation window |
|---|---|---|
| Activation | Eligible new workspaces that publish an approved knowledge set, install on an allowed production domain and receive one non-preview visitor conversation within 7 days / eligible new workspaces | ≥60%; first 30-day signup cohort. Exclude staff/test accounts only using documented flags. |
| Owner onboarding effort | Active owner time spent completing self-service setup, preview/publication and widget installation | Median ≤30 minutes in ≥10 observed self-service sessions; measure any later assistance separately |
| Optional assistance scheduling | Time from an assistance request to an agreed appointment and resolution | Best effort/appointment-based; no fixed turnaround guarantee. A booking is not required to import, preview, publish or activate. |
| Pilot conversion | Free-pilot workspaces with a settled Starter payment within 14 days of pilot end / pilot workspaces whose conversion window has elapsed | Collect baseline and report counts by service segment; no assumed conversion success |
| Paying customers | Workspaces with a settled, non-refunded paid service period; exclude trials and one-time setup-only purchases | 10–20 within 90 days of paid launch |
| Month-2 logo retention | First-month paying workspaces still paid and active at their second renewal / first-month paying cohort eligible for that renewal | ≥70%; disclose censoring and cohort size |
| Verified AI resolution | Eligible conversations explicitly marked helpful/resolved by the visitor, with no handoff and no same-conversation reopen within 24h / eligible support conversations | ≥40% during pilot as a hypothesis; do not call this total business deflection |
| Recurring gross margin | (Net recurring revenue minus attributable recurring AI, infrastructure, payment and support delivery costs) / net recurring revenue | Proposed ≥70% at full included allowance before broad sale; disclose one-time included setup cost separately |
| Assisted setup payback | Actual included setup delivery cost / monthly recurring contribution after delivery costs | Proposed payback within 3 paid months; report first-month contribution including setup cost, pilot cost and conversion assumptions |
| MRR | Monthly recurring service revenue excluding tax, setup fees, prepaid usage packs and refunds/credits | KES 100,000 by month 6 is aspirational. At Starter-only KES 2,500 this requires 40 paid workspaces, before discounts. |
| CSAT | Helpful ratings / all submitted ratings, with response rate shown | Collect baseline; agree target after pilot, rather than fabricating one |

An eligible support conversation has at least one genuine visitor question; preview, staff tests, confirmed spam and system-only threads are excluded with reason codes. An AI reply is not proof of resolution. Visitor silence and timeout closures must be labeled **unconfirmed closure**. Cross-session return visits cannot reliably be deduplicated without identity; report this limitation.

### 3.2 Instrumentation

Emit versioned, tenant-scoped events for `workspace_created`, `source_ready`, `knowledge_published`, `preview_completed`, `widget_live`, `conversation_started`, `answer_committed`, `fallback_requested`, `handoff_requested`, `handoff_claimed`, `human_reply_committed`, `conversation_resolved`, `conversation_reopened`, `feedback_submitted`, `payment_verified`, `entitlement_changed` and `usage_committed`.

Include event ID, organization ID, object ID, UTC timestamp, environment, schema version and reason/status where applicable. Deduplicate on event ID. Analytics must derive billing usage from the canonical ledger, not browser events. Never place raw message text, phone numbers or document excerpts in general analytics. Dashboard freshness target: ≤5 minutes; display last refresh time and timezone.

## 4. MVP scope and limits

### 4.1 Release boundary

| Area | MVP — required | Later / excluded |
|---|---|---|
| Access | Verified email/password, reset, workspace, owner/agent roles, invitations | Google login, phone login, SSO, agency hierarchy |
| Knowledge | Manual FAQs, TXT, text-based PDF, DOCX, one public URL at a time; preview and explicit publication | OCR/scans, sitemaps, recursive crawling, scheduled sync, catalogs and private connectors |
| Widget | Async embed, mobile layout, branding, suggested prompts, session history, citations, optional contact capture, human button | Visitor file/image uploads, payments or tools executed inside chat, native apps |
| AI | Approved FAQ answers, calibrated fallback, policy rules and human handoff in English and Swahili; both language slices must pass | Live data lookup, transactional actions, guaranteed Sheng support, web browsing, fine-tuning, open-ended agents |
| Handoff | Durable inbox, atomic claim, transcript, internal notes, business hours, email alerts, human website reply | Email reply ingestion, WhatsApp inbox, complex SLAs, AI reply suggestions |
| Analytics | Volume, answer/fallback/handoff counts, explicit outcomes, usage and unanswered-question list | Revenue influence, campaign attribution, automatic FAQ publication |
| Billing | One KES plan, IntaSend M-Pesa STK collection, manual monthly renewal, receipts, caps and prepaid top-ups | Automatic debit, cards, per-resolution invoices, merchant order payments |
| Trust / operations | Tenant isolation, audit, export/deletion, backups, abuse controls, eval gates, support runbooks | Compliance certifications, enterprise contractual SLA |

**Confirmed:** Starter includes two named staff accounts (owner + one agent), each with a separate login. The owner may operate both roles. The unanswered-question list is the MVP knowledge-gap report: group by reason/topic, show safe excerpts to authorized staff, link to the source conversation and let an owner draft a FAQ. No unsupervised knowledge changes.

### 4.2 Initial product limits — delegated and configurable

| Resource | Starter / free-pilot limit or proposed default |
|---|---|
| Workspace | Confirmed: one business, one production website/widget; www/apex variants count together. Engineering default: explicit allowed origins and a separate non-production preview. |
| Seats | Confirmed: 2 named staff accounts total (owner + one agent), with separate logins. Revocation behavior remains a required technical safeguard. |
| Knowledge | Delegated initial limits: pilot 5 sources / 10 MB raw / 500 indexed chunks; Starter 20 sources / 25 MB raw / 1,000 chunks. Max 2 MB/file and 50 pages; extraction also bounded. Display limits before upload; review using observed quality/capacity. |
| Public URL import | Single page, ≤2 MB HTML, ≤15 seconds fetch, ≤3 revalidated redirects; no authenticated fetch |
| Message | 2,000 characters/visitor turn; plain text; 30 visitor turns/conversation then offer a new thread or handoff |
| AI budget | Initial ceiling 8,000 input tokens and 600 output tokens per generation; at most one retry; tune using §7 results |
| Concurrency | 3 AI generations/workspace; excess gets a visible retry or handoff option; bounded queue ≤10 seconds |
| Included usage | Paid: confirmed 1,000 billable AI replies/service month. Free pilot: confirmed 100 AI replies total over 30 days from go-live. Preview: proposed 50 generations/day/workspace, nonbillable. |
| Session | Visitor token expires after 24h; resumption requires an unexpired scoped token; no identity claims from an entered phone number |

Limits require clear validation messages and remaining-capacity visibility. A plan increase must never bypass security limits. A valid document that exceeds the supported extraction boundary gets actionable guidance rather than silently truncated publication.

## 5. Roles and journeys

### 5.1 Permission model

| Capability | Owner | Agent | Visitor | Platform operator |
|---|---|---|---|---|
| Billing, members, publication, domains and workspace deletion | Yes | No | No | Audited emergency process only |
| Knowledge drafts and preview | Yes | Read published context only | No | Owner-granted, scoped setup access or temporary support access |
| Inbox, assignment, notes and conversation export | Yes | Yes, for that workspace | Own visitor-visible thread only | Temporary support access only |
| Workspace-wide data export / deletion | Yes, reauthentication required | No | Privacy request through supported process | Authorized privacy workflow |
| Public widget | Test | Test | Send/read own thread | Test environment only |

A Sema setup specialist may prepare knowledge/configuration drafts only under a time-bounded owner grant scoped to that workspace. Publication, billing, member changes and deletion remain owner-controlled. Setup actions record the specialist actor and owner approval; never impersonate the owner or request shared passwords. Use guided snippet installation or explicitly authorized site access rather than collecting website credentials into Sema. Revoke setup access at completion; later help requires a new grant.

Authenticate staff through the assessed Convex-compatible Better Auth integration; authorize every action using current application membership. An auth account is not automatically a workspace membership. Keep at least one owner; ownership transfer requires verified acceptance. Internal notes, payment details, retrieval diagnostics and other visitors' messages must never enter the visitor event stream.

### 5.2 Happy paths and essential failures

1. **Owner, self-service:** Verify email → create workspace and declare eligible non-regulated use → configure business details/support/hours/privacy → import permitted public-safe knowledge immediately within quotas → review extraction and preview English/Swahili answers → explicitly publish → install the snippet and verify control of the production site → pass automated readiness checks → if the initial pilot offer is open and the business is eligible, activate and start its free 30-day/100-answer pilot at verified go-live; otherwise authorize Starter payment and activate only after verified settlement. Show the applicable offer, exact service dates and payment requirement before activation. Registration does not reserve a free pilot. No founder approval or assistance appointment is required. Ingestion failures preserve the last published corpus. The owner may request included, appointment-based assistance afterward under a scoped grant; the business maintains ongoing FAQs.
2. **Visitor:** See AI/privacy disclosure → ask question → receive supported answer and source label → rate helpfulness or request a person. If knowledge is insufficient, receive one clarifying question or a fallback; contact submission is optional and never required to read a general answer.
3. **Agent:** Receive minimal-content alert → open authenticated inbox → claim handoff → review transcript → reply → resolve. Only one agent can claim at a time. AI remains paused until an authorized resume action.
4. **Staff unavailable:** Only show live-human availability when the business is within configured hours and a signed-in agent is available. Otherwise show an honest away message, the configured next staffed time where known, optional contact capture and existing support channel. Persist every accepted handoff request and email staff even while away. Never promise an instant response solely because hours indicate open.
5. **Payment:** Owner sees amount and service period → requests STK → payment stays pending until provider verification → receipt and entitlement appear. A failed/canceled prompt does not activate service; a delayed success is reconciled.
6. **Outage or allowance exhausted:** Explain that automated replies are unavailable; keep the human route and support details accessible. Never manufacture a response or silently charge additional usage.

If a visitor leaves or their website session expires, an agent may use the optionally supplied contact details through the business's existing approved support channel. Such replies are manual and are not synchronized back from email/WhatsApp in MVP. Show this limitation and do not claim the visitor received an inbox reply merely because it was saved. Contact entry does not verify identity or authorize account-specific disclosure.

## 6. Functional requirements and acceptance criteria

All FR items below are MVP requirements. “Given / when / then” scenarios must be automated where repeatable and complemented by observed end-to-end QA. Product owns behavior; Engineering owns implementation; QA owns evidence. Security and AI specialists co-own their respective gates.

### 6.1 Workspace and knowledge

| ID | Requirement | Acceptance criteria |
|---|---|---|
| FR-01 | Staff signup, verification, login and recovery | Given an unverified account, when it attempts publication or invitation, then access is denied with a verification step. Reset links are single-use/expiring; invalid login/reset responses do not reveal whether an account exists. |
| FR-02 | Workspace tenancy and membership | Given members of workspaces A and B, when A substitutes B's IDs in API, file, export, retrieval or socket requests, then no B content or metadata is returned. Role removal invalidates protected access within 60 seconds, including open sockets. |
| FR-03 | Business configuration | Owner can set display name, logo, safe welcome text, approved domains, support contact, privacy link, hours and timezone. Invalid domains, unsafe URLs and agent edits are rejected. Default timezone is Africa/Nairobi; closed/holiday overrides preview correctly. |
| FR-04 | Idempotent ingestion | A valid supported file/page becomes a versioned draft with extraction status and content preview. Duplicate retries do not duplicate chunks or charges. Scanned, encrypted, malformed, oversized or unsafe content fails explicitly; no failed draft is retrieved by live chat. |
| FR-05 | Knowledge preview, approval and publication | Every new/changed FAQ, document or imported page remains draft-only until the owner previews that version and explicitly publishes it. Editing after preview invalidates its preview record. Saving, extraction and indexing cannot publish automatically. Publication changes the active corpus pointer atomically to a fully indexed version; live chats use only active approved chunks. Retain the last published version until replacement publication. Unpublish/delete stops retrieval immediately; rollback to eligible retained content requires owner preview and publication. |
| FR-06 | Source controls | Owner can edit FAQs, unpublish, replace and delete sources and inspect last-indexed/version status. On delete, content is immediately excluded from new retrieval and pending answer commits; physical purge follows §10.4. A conflicting policy preview flags the conflict rather than choosing silently. |

### 6.2 Visitor conversation and human support

| ID | Requirement | Acceptance criteria |
|---|---|---|
| FR-07 | Safe embed and initialization | Given an allowed HTTPS origin, widget loads asynchronously and receives a scoped visitor session. An unapproved origin cannot obtain a normal session. Public embed IDs contain no secrets; spoofed origins still face token checks, quotas and abuse controls. Host-page errors do not break the host page. Show the business's logo/colors and a small Powered by Sema attribution; full white-labeling is unavailable at launch. |
| FR-08 | Session history and isolation | Refreshing with an unexpired session restores that visitor's committed messages. Clearing/expiring the token starts a new session; guessing a conversation ID returns no content. Separate tabs deduplicate turn IDs. Shared-device users can clear local chat history. |
| FR-09 | Grounded answer with evidence | Given an answerable approved FAQ, when queried, then the factual response is supported by retrieved active chunks, has at least one valid source reference and records corpus/model/prompt versions. A source reference cannot expose a private file or a cross-tenant URL. |
| FR-10 | Clarify, abstain or escalate | Missing, conflicting, stale-sensitive or irrelevant knowledge yields a clarification or clear fallback. Explicit human requests pause AI immediately and create one durable handoff. Reading a public refund policy is allowed; granting a refund or adjudicating a dispute is handed to a human. |
| FR-11 | English and Swahili at launch | Visitor can select English or Swahili and switch during the conversation; replies, system/fallback messages, contact forms and handoff status use the selected language. Both language slices pass §7 before customer launch; English-only launch is not an accepted fallback. Allow English or Swahili source content to support answers in either selected language without requiring duplicate translated sources. Preserve numbers, prices and policy meanings across languages and retain original evidence provenance. Unsupported language/uncertain code switching offers a human or supported language without inventing an answer. |
| FR-12 | Contact and privacy UX | Before first submission, show AI identity, retention summary and business privacy link. Optional name/email/phone fields explain follow-up purpose and record notice version, timestamp and applicable permission. Declining contact capture still permits FAQ chat. Invalid numbers fail clearly; accepted Kenyan formats normalize to E.164, including valid 01xx/07xx variants. |
| FR-13 | Inbox and atomic takeover | Two agents claiming simultaneously produce one winning assignment. Visitor and inbox show waiting/human-active states. A human reply cannot race with an AI commit; pending AI generation is canceled or rejected on state recheck. Internal notes never reach the visitor. |
| FR-14 | Handoff delivery and honest availability | Show live-human availability only when configured hours and a currently available signed-in agent both qualify. Otherwise show away copy and optional contact capture; human requests remain possible and durable. Handoff commits before email notification, with a protected inbox link/minimal metadata. Retry delivery failure without losing the request. Stale presence, closed hours and no available agent cannot produce an online claim. Contact absence is visible to staff; no instant-response guarantee. |
| FR-15 | Resolution and resumption | Agent can mark resolved and visitor can reopen. “Resume AI” is explicit and audited. New visitor messages after resolution reopen waiting-human unless staff resumes AI. No automatic bot reentry during an active human thread. |
| FR-16 | Reconnect and duplicates | Given connection loss after a committed reply, reconnect with last event sequence fetches missing authorized events once for display. Reposting the same client turn ID returns the existing outcome without duplicate AI generation, messages or usage. |

### 6.3 Reporting, payment and administration

| ID | Requirement | Acceptance criteria |
|---|---|---|
| FR-17 | Truthful analytics | Dashboard distinguishes answered, fallback, handoff, explicit resolution and unconfirmed closure. A fixture set reconciles dashboard counts and usage ledger exactly; filtering excludes preview/test events and displays timezone. |
| FR-18 | Actionable knowledge gaps | Authorized staff can filter unanswered questions by reason and period and open the originating thread. Owner can draft an FAQ, review it and publish via FR-05. Deletion/retention removes or anonymizes linked excerpts; low-count topics do not leak across tenants. |
| FR-19 | Payment verification and entitlement | STK initiation displays pending; forged callback, incorrect challenge, wrong currency/amount/reference, non-complete or unverified status cannot activate a subscription. A verified complete payment creates one receipt and one entitlement effect under replay and out-of-order tests. After initial pilot enrollment closes, a new workspace cannot provide live AI or live human chat before verified Starter payment; an STK request or browser redirect cannot bypass that gate. |
| FR-20 | Usage and spend limits | With one reply remaining and simultaneous requests, at most one billable answer commits. On paid quota exhaustion, pause AI and retain human chat; the owner can explicitly buy a prepaid top-up. No automatic charge or negative quota. Display 80%/100% notices and itemized usage. Top-ups are KES 500/100 answers with original 90-day expiry; expired packs and inactive subscriptions cannot fund AI commits. Price and entitlement must match the verified purchase contract. |
| FR-21 | Subscription lifecycle | Free-pilot 100-reply exhaustion, 30-day expiry, explicit paid conversion, post-pilot paid activation, on-time renewal, late renewal, cancellation, duplicate payment, refund and provider reversal follow §8. Closing pilot enrollment does not shorten an enrolled pilot or grant new free service to later registrations. Staff can inspect the ledger; only authorized owner/operator actions change financial state and all are audited. |
| FR-22 | Privacy operations | Owner can choose 90-day or 30-day conversation retention, export tenant data and request earlier deletion after reauthentication. Export is private, expires in 24h and excludes credentials/internal platform data. Tests verify erasure across raw files, text, vectors, conversations, caches, event payloads and processors under §10. |
| FR-23 | Audit and emergency controls | Record member, knowledge, configuration, billing and support-access changes without secrets. Authorized operator can pause AI globally or per workspace; this takes effect within 60 seconds and leaves human handoff available. |
| FR-24 | Abuse and limits | Oversized content, burst requests, malicious uploads, injected HTML, prompt attacks and quota bypass attempts are rejected or safely handled. Legitimate clients receive a retry path; safeguards apply before expensive model calls. |

### 6.4 Self-service activation and optional assistance

| ID | Requirement | Acceptance criteria |
|---|---|---|
| FR-25 | Immediate self-service activation and included follow-up assistance | A verified eligible owner can import, preview, explicitly publish, install and activate without founder approval or booking, subject to automated domain/readiness, resource and applicable payment checks. During the initial open pilot phase, verified go-live starts the eligible business’s 30-day clock; previews/imports do not. After pilot enrollment closes, imports and preview remain available within limits, while live activation requires verified Starter payment. Test both offer states, duplicate eligibility attempts and a closure racing with activation; pin the accepted offer version atomically and preserve any already-enrolled pilot’s original end date. Failures show a specific fix/retry path. Assistance is optional afterward, included within the agreed scope and scheduled best effort. Scoped specialist access cannot publish without owner approval or alter members/billing; revoke it at completion. |

### 6.5 State and delivery rules

Conversation states: `ai_active → waiting_human → human_active → resolved`. Explicit operator resume permits `waiting_human/human_active → ai_active`; a new visitor message can reopen `resolved → waiting_human`. Any enabled state can be marked `spam` by staff; abusive clients lose sending access without deleting audit evidence prematurely. “Pending” in the UI means waiting for an agent/customer with a reason; it must not ambiguously restart AI.

Knowledge states: `uploaded → scanning → extracting → indexing → draft_ready → published → retired`, with `failed` and `deletion_pending/deleted` branches. Unpublish immediately removes eligibility. Historical versions cannot be restored after their underlying data is erased.

Persist accepted visitor messages before acknowledging. Use client turn IDs, server message IDs, ordered conversation sequence numbers and a transactional outbox. Transports and jobs deliver at least once; enforce single durable business effects through indexed idempotency checks inside transactional mutations and idempotent consumers. Do not claim exactly-once network delivery.

For each AI request, snapshot the current corpus, reserve quota, retrieve, generate, validate support/citations, then recheck membership/session, conversation mode, active source eligibility and reservation expiry before atomically committing the answer, usage and outbox entry. If source deletion or human takeover occurred, discard the candidate and release the reservation. Never hold a database transaction open during a model call.

MVP displays completed validated answers rather than streaming unvalidated claims. A typing indicator is allowed. When streaming is added later, it must preserve the same safety and billing semantics.

## 7. RAG behavior and evaluation

### 7.1 Knowledge and answer contract

1. **Ingest safely.** Scan and extract in an isolated worker. Preserve source ID, version, checksum, page/section, language, approval actor/time and extraction warnings. Ignore embedded instructions, macros and scripts. Owners attest they have rights to upload and publish the content.
2. **Prepare reproducibly.** Initial candidate chunking: 300–600 tokens with 50–100-token overlap, retaining headings and tables where possible. This is a tuning starting point, not a fact about optimal retrieval. Record embedding model/version/dimension and extractor/chunker versions.
3. **Retrieve within authorization.** Filter by organization, published corpus and active-source eligibility before returning candidates. Use Convex vector retrieval plus full-text/exact-field retrieval for prices, place names and codes, with a server-derived tenant/published-corpus partition and authorization rechecks; tune retrieval/fusion on held-out data. Initial candidate size 8, final context ≤5 chunks, subject to token budget.
4. **Assess answerability.** Use retrieval relevance, evidence coverage, contradictions, query category and evaluation-calibrated thresholds. Similarity thresholds are model/corpus dependent; never expose “87% confident” without calibration evidence. The owner can configure escalation categories, not lower the platform's safety floor.
5. **Generate within evidence.** Treat retrieved text and visitor content as untrusted data, not instructions. Answer only supported business facts; do not use general model knowledge to fill missing prices, deadlines or policies. Use configured safe templates for greeting, clarification and fallback.
6. **Validate before commit.** Check that references point to eligible retrieved chunks and all material claims have support. Invalid references, contradictions or failed checks trigger abstention. Automated checking reduces risk; it cannot guarantee zero hallucinations.
7. **Preserve provenance.** Store decision reason, source/chunk IDs, corpus version, retrieved scores, model/prompt/embedding versions, latency and token/cost metadata. Restrict any retained evidence text under §10. Do not store hidden chain-of-thought.

Public citations show source title, page/section and an approved supporting excerpt. Public website citations may link only to approved safe URLs. Uploaded-source citations use a controlled excerpt view; never expose object-store credentials or the whole original file by default. After deletion, historical references show “source removed” without serving deleted text.

For contradictory sources, ask the owner to resolve the conflict and hand off the affected question. Newer upload time is not sufficient authority. For live-sensitive questions such as stock, personal order status or availability, state the static-information limitation and offer the support channel. Multi-turn retrieval must resolve references such as “what about Kisumu?” from bounded session context without widening tenant scope.

### 7.2 Fallback policy

| Trigger | Required behavior | Recorded reason |
|---|---|---|
| No evidence or evidence below calibrated threshold | Ask one relevant clarification if likely useful; otherwise offer a person/support contact | `no_evidence` / `low_relevance` |
| Conflicting approved information | Avoid choosing a policy; offer handoff and flag knowledge issue | `source_conflict` |
| Explicit human request or dissatisfaction after failed help | Pause AI; create handoff without requiring further bot questions | `human_requested` / `unsatisfied` |
| Personal data lookup, dispute decision, legal/medical/financial advice | Explain limitation and route to authorized business staff | `sensitive_or_unsupported` |
| Prompt injection, secret request or cross-tenant request | Ignore malicious instructions; refuse unsupported disclosure; offer a safe next step | `policy_blocked` |
| Provider outage, timeout, budget or quota exceeded | Clear availability message and human route; no billable answer | `provider_error` / `quota_exhausted` |

The bot may explain a published refund policy; it must not approve a refund. General M-Pesa payment instructions from approved knowledge are allowed; collecting an M-Pesa PIN, OTP, card data or account credentials is prohibited.

### 7.3 Evaluation dataset

Before pilot, build a versioned corpus and at least **300 labeled cases** from 3–5 representative partner businesses, using synthetic or consented/de-identified questions. Proposed category allocation: 150 answerable, 60 unanswerable, 30 contradictory/stale-sensitive, 30 adversarial/privacy and 30 multi-turn/handoff cases. Categories are mutually exclusive for counting; add language and tenant-security tags independently.

Include Kenyan place names, service areas, published service prices, spelling variants, ambiguous references, currency, tables, empty retrieval, changed policies, explicit human requests, instruction attacks inside documents, and direct/indirect disclosure attempts. English and Swahili are required: include at least 75 cases for each language spanning the categories above, with Swahili and representative code-switched cases reviewed by a fluent Kenyan Swahili evaluator. These language tags cross-cut the 300-case allocation. Add paired questions that must preserve the same price, hours and policy meaning across languages. Explicitly test English questions over Swahili-only sources and Swahili questions over English-only sources, including missing/contradictory evidence; do not assume cross-language retrieval works because the final answer is fluent. Unsupported Sheng remains an explicit limitation.

Each case has tenant/corpus version, question/context, expected answerability/action, relevant source IDs, key supported facts, prohibited claims and severity. Keep tuning and held-out release sets separate (initial 70/30 split stratified by category/language); do not tune on the release set. Expand the set as failures are found. Run a separate comprehensive two-tenant isolation suite; the 30 adversarial cases do not replace security testing.

### 7.4 Proposed release thresholds

| Metric | Definition | Gate |
|---|---|---|
| Retrieval recall@5 | Answerable cases with a gold supporting source in top 5 / answerable cases with gold sources | ≥90% overall and each supported language |
| Grounded answer precision | Audited factual claims supported by the cited active corpus / audited factual claims in emitted answers | ≥95%; no critical unsupported price, payment, safety or entitlement claim |
| Answer correctness | Emitted answers judged factually correct and sufficient against expected facts / emitted answers on answerable cases | ≥90%; assess alongside coverage so abstention cannot game quality |
| Answer coverage | Answerable cases receiving a correct substantive answer / all answerable cases | ≥75% initially, with safe handoff on remainder |
| Citation validity | Citations resolving to eligible retrieved evidence / all emitted citations | 100% |
| Correct abstention/escalation | Unanswerable/conflicting/policy-blocked cases receiving expected safe action / such cases | ≥95% |
| Explicit human takeover | Human-request cases creating handoff and suppressing subsequent AI commits / tested cases | 100% |
| Privacy and tenant isolation | Unauthorized disclosure or write in adversarial/isolation suite | Zero observed critical failures; any failure blocks release |
| Language quality | Supported-language answers rated understandable and appropriate by bilingual reviewer / reviewed answers | ≥90%, with the factual/safety gates above also passing |

Calculate on the held-out set, report raw counts and uncertainty, and disclose small language/category samples. These thresholds are proposed minimums, not proof that production errors will never occur. Extend testing if a category has too few examples to support a launch claim. Safety regressions block release even when aggregate scores improve.

Use human rubrics as the release authority. Model-as-judge scoring may assist triage only after comparison against human labels; it must not be the sole gate. Have two reviewers independently label at least 20% of the set and adjudicate disagreements; one reviewer must understand the source domain and language. Never send private production transcripts to an external evaluator without the applicable data controls.

### 7.5 Continuous improvement

Run offline evaluation on every model, prompt, embedding, extraction, retrieval or policy change; retain baseline and diff. During pilot, review at least 50 sampled answers/week across tenants/languages, all reported harmful answers, and critical handoff failures. If volume is lower, review all with appropriate access controls. Track correctness, abstention reasons, correction rate, source age, latency and cost.

Promote through a small canary cohort only after offline gates pass. Stop or revert for any critical disclosure/unsupported payment claim, >5 percentage-point quality decline on the reviewed comparable sample, or sustained error/latency breach. Low sample size may require manual hold. Rebuild embeddings side by side and atomically switch corpus versions; never mix incompatible vector dimensions. An owner-approved FAQ derived from a gap follows the ordinary preview/publication process.

## 8. Plans, metering and billing

### 8.1 Confirmed launch offer and initial-pilot boundary

**Confirmed launch offer:** Starter at a **KES 2,500 base price per service month for 1,000 AI replies, with standard assisted setup included**, plus applicable tax and disclosed payment-processing fees. The user has confirmed price, included reply quantity and setup inclusion. The substantive-answer counting rule is also confirmed (§8.2). Two named staff accounts (owner + one agent) are confirmed. One business/production website with business branding and Powered by Sema attribution is also confirmed; allowed-origin mechanics and storage limits are delegated engineering defaults.

**Confirmed initial pilot:** Free for **30 days from the business's verified production-widget go-live**, not from workspace creation or document upload. No setup charge, subscription collection or payment method is required to enter the pilot. The pilot ends after 30 × 24 hours; show exact start/end timestamps. The confirmed allowance is **100 AI replies per business across the full 30-day pilot**, not 100 per day. Pilot quota is separate from paid usage and does not renew during the pilot. **Public self-signup during the pilot is confirmed.** Registration must not require a personal invitation. Immediate self-service imports, preview and activation are confirmed. Require automated email/domain/eligibility/readiness checks, owner preview/publication and quota enforcement, not a founder queue. Resource exhaustion may temporarily block work with clear retry guidance; it must not be disguised as mandatory assisted onboarding. **Confirmed ongoing offer:** The free 30-day/100-answer offer is available only while initial pilot enrollment is open. Later customers may publicly register, prepare and preview knowledge within resource limits, but must make a verified Starter payment before live activation. There is no ongoing free trial. Maintain an auditable, versioned pilot-enrollment flag; display the current offer before activation. Registration alone does not reserve free service. Closing enrollment preserves each already-enrolled pilot’s promised expiry and allowance. Do not invent a fixed global pilot closing date; announce it when set and preserve accepted terms.

Provide the paid Starter terms before enrollment and reminders near pilot end. Conversion requires an explicit owner purchase and verified payment; there is no automatic charge or presumed subscription. Do not offer a discounted or paid initial pilot. **Confirmed pilot exhaustion policy:** At 100 replies, pause further AI answers for the remainder of the pilot while preserving human handoff/inbox access until pilot expiry; show remaining time, exhausted quota and the optional Starter conversion. Free-pilot top-ups are not offered in MVP. At time expiry, apply the disclosed pause/export policy unless the owner converts. Early conversion requires an explicit purchase explaining that the free pilot ends and a fresh paid period begins. Any extension is explicit, time-bounded and logged; duplicate workspace creation must not reset pilot eligibility. After initial pilot enrollment closes, new customers follow paid-before-go-live activation; existing pilot customers retain their promised terms until expiry or explicit early conversion.

**Included assistance after self-service — confirmed boundary, proposed operational checklist:** One business/workspace/site: intake, help organizing existing public-safe FAQs/documents, branding/hours/escalation configuration, English/Swahili preview checks, widget installation guidance/verification, and owner/agent handoff training. Record assistance scope and owner approval for any publication. Assistance does not gate initial self-service use. The business supplies accurate content, authorizes publication, provides an available human contact and maintains future FAQs. Custom website development, large-scale copywriting/translation, custom integrations, operating the business's support inbox and ongoing managed FAQ maintenance are excluded; any separately quoted project must be explicit and must not reclassify standard setup as an extra fee.

**Confirmed prepaid top-up offer:** KES 500 base price for 100 additional substantive answers, plus applicable tax and disclosed payment-processing fees, purchased explicitly by the owner, valid for **90 × 24 hours from verified purchase** and usable only while the paid subscription is active. Packs do not expire at monthly renewal; display each pack's remaining replies and exact expiry in Africa/Nairobi before purchase and in the usage view. They do not extend or reactivate the subscription. Inactive time does not restart the stated 90-day lifetime. No automatic top-up or postpaid overage.

**Confirmed consumption and reset rule:** Use the current month's included allowance first, then unexpired top-up packs in earliest-expiry order. Unused monthly included replies reset at renewal; unexpired purchased packs retain their balance and original expiry. Expired packs cannot be spent or reserved. Admission and commit checks enforce both active subscription and pack expiry. The former end-of-month pack expiry and final-24-hours purchase restriction are superseded by the confirmed 90-day offer.

**Confirmed price-display policy:** KES 2,500 and KES 500 are base amounts, not all-inclusive checkout totals. Applicable tax and payment-processing fees are added and itemized before payment. Show base, tax basis/amount, processing fee, final KES total, service/pack details and expiry; require the owner to authorize that total. Quote and lock the payable amount server-side before starting STK. Never append a fee after authorization or trust client-supplied amounts.

Tax applicability/rates/registration, provider permission for the intended fee recovery, the fee calculation/quote method and invoice compliance remain Finance/Legal/vendor evidence gates under O03. A pricing preference does not establish those facts. If a lawful, accurate total cannot be quoted, paid checkout remains disabled. Cancellation/refund intent is confirmed below, subject to mandatory rights and actual provider process. Any proposed change to the confirmed base offer requires a new explicit product decision. Display the final total, applicable tax or exemption basis, fees, pack expiry, period and cancellation terms before payment. Store integer minor units (KES cents), never binary floating-point amounts. Do not assume an ordinary payment receipt satisfies any applicable KRA/eTIMS tax-invoice obligations; resolve invoicing requirements at the billing gate.

The draft's Growth **KES 6,500 / 5,000 replies**, Pro **KES 15,000 / 15,000 replies** and custom Enterprise plans remain research options. Do not sell them or advertise WhatsApp, live integrations, priority support or SSO as included until implemented, costed and separately accepted. Do not use one plan's pooled allowance across unrelated businesses.

### 8.2 Confirmed usage unit and proposed implementation safeguards

**Confirmed counting rule:** A **billable AI reply** is one completed, validated, substantive knowledge-grounded assistant answer to one accepted visitor turn, committed to the live conversation and made available for that visitor to retrieve. It is a persistence/availability event, not a claim that the visitor read it or the problem was resolved. Multiple answer paragraphs and citations are one unit. A retry of the same turn or a reconnect cannot create a second unit.

Nonbillable: previews, greetings, human replies, contact forms, system notices, clarification-only messages, refusal/fallback/handoff messages, failed/partial generations, discarded candidates, duplicate deliveries and outage/quota notices. Record their provider and infrastructure costs even though the customer is not charged. A poor but completed substantive answer is initially metered; confirmed product-error disputes receive an auditable credit under §8.5.

Reserve one allowance unit atomically before generation, with a 60-second lease; the answer timeout is shorter (§11). Commit answer + usage + outbox atomically only while the lease and entitlement remain valid. Release on failure; a sweeper reclaims expired reservations. Deduplicate the live unit with a unique `(organization_id, visitor_turn_id, meter_type)` key. Preview and abusive/nonbillable traffic have separate rate/cost caps. No negative balance under concurrency.

Maintain separate append-only **customer usage** and **internal cost** ledgers. Cost includes model attempts/retries, embeddings, extraction, storage, queue, realtime delivery and vendor fees. Usage corrections are reversing entries, not silent edits. Owner can inspect date, conversation/turn, unit, included/top-up bucket and correction reason. Price and entitlement versions are immutable on each purchase/period.

### 8.3 Subscription and service period semantics

States begin at `setup_pending`. Eligible initial-pilot activation enters `trialing`; a later customer's ready workspace enters `payment_required → active` only after verified payment, without a free-pilot state. Subsequent paths are `trialing → active`, `trialing → trial_expired` and `active → past_due → suspended`; explicit cancellation sets `cancel_at_period_end`, then `canceled`. A verified payment can restore eligible expired/canceled/suspended accounts without resurrecting erased data. Account deletion is a separate lifecycle.

- A paid service month starts at payment verification; renewals use a calendar-month anniversary in Africa/Nairobi, retaining the original day-of-month anchor and clamping each boundary to the last day when needed (31 January → 28/29 February → 31 March). Store boundaries in UTC and display Africa/Nairobi. Free-pilot conversion starts a fresh paid period and fresh 1,000-reply allowance; unused free quota is not charged or rolled into a purchase. The `trialing`/`trial_expired` backend states represent the free pilot and must be labeled “free pilot” in the owner interface.
- **Confirmed renewal choice:** Each month the app issues reminders and a renewal invoice; the owner explicitly authorizes and completes an M-Pesa payment. There is no unattended recurring debit at launch. M-Pesa STK is **customer-authorized collection**. [IntaSend STK documentation](https://developers.intasend.com/guides/collections/mpesa-stk-push/) documents a phone prompt requiring the payer's PIN.
- Send opted-in service reminders 3 days and 1 day before expiry, at expiry and once during grace. Do not send repeated STK prompts without owner action. Offer in-app status if notification delivery fails.
- **Confirmed missed-renewal access policy:** AI pauses immediately at paid-period expiry, including use of unexpired top-ups. Human chat continues for a three-day grace period. After grace, no new live chat/visitor messages or content changes are accepted: staff retain read-only inbox/export access for 30 days, and the widget shows static business contact details. A boundary table and server-side entitlement checks must enforce this; hiding the UI is insufficient.
- **Delegated billing-calendar baseline:** Early renewal prepays the next period without resetting current quota. Renewal verified within the three-day grace retains the original anniversary; later renewal starts a new paid period at verification. Display exact period boundaries before payment and verify month-end, leap-year, grace-boundary and delayed-payment cases before sale. For a new post-pilot customer, complete readiness checks before requesting payment where possible; disclose that its paid period starts at verification, even if installation is delayed.
- **Confirmed free-pilot time-expiry access:** At day 30, stop AI and live human chat; retain staff read-only inbox/export access for 30 days and show the business's static contact details. Free pilots do not receive the paid-renewal human-chat grace. The paid read/export clock begins when its three-day human grace ends; the pilot read/export clock begins at pilot expiry.
- **Confirmed inactive-workspace cleanup:** After the read/export window, delete knowledge, conversations, contacts, notes, source/citation evidence and linked personal content using §10.4. Preserve only the minimal payment and unexpired top-up ledger, subject to verified legal retention. If the verified same owner later pays before a pack expires, restore its remaining balance to an active empty workspace with its original expiry; never restore erased content. This does not transfer credit to another business or grant another free pilot. Requested permanent account erasure uses the verified privacy/financial process.
- **Confirmed cancellation policy:** Stop future renewal intent/reminders; maintain already-paid service to period end, then apply the confirmed expiry-access/cleanup policy. No routine change-of-mind proration, subject to mandatory rights. Cancellation is not immediate data erasure. In-period tier changes are deferred; top-ups do not extend the paid period.
- Refunds, credits and reversals are separate financial events; never overwrite settled transaction history. Use explicit reason codes, evidence and authorized approval.

### 8.4 Payment lifecycle and reconciliation

1. Create a local invoice with tenant, purchase type, price version, expected currency/gross amount, period and unique reference. A payment attempt has its own idempotency key and provider resource ID; serialize active STK initiation for an invoice.
2. Call IntaSend server-side. A request acknowledgement or browser redirect means **pending**, never paid. Keep provider secrets and webhook challenge outside the client and logs.
3. Persist callbacks into a restricted inbox after validating the configured challenge and payload shape. Accept valid duplicates safely; acknowledge quickly after durable capture. Reject invalid requests. Do not invent an HMAC header scheme absent from the selected IntaSend API contract.
4. Before granting service, query authoritative provider status using server credentials; require `COMPLETE` and match invoice/reference, expected currency, gross amount, merchant/environment and resource ID. Failures/unverifiable responses remain pending, with no entitlement. Never rely on screenshot, phone number, client request or net settlement amount alone.
5. Atomically apply a unique provider-payment allocation to the local invoice, receipt and entitlement. Older pending/failed callbacks cannot downgrade a settled payment; only a verified reversal/refund event can alter it. Outbox messages deliver receipts after commit.
6. A worker rechecks pending attempts after 1, 5, 15 and 60 minutes and at 24 hours, within provider rate limits. Show “still checking” rather than falsely failed. Perform daily reconciliation of provider collections/settlements against local payments and flag unmatched/duplicate/partial/reversed transactions. The founder owns exception review and escalation; one business day is an internal review target, not a guaranteed customer response or settlement time. Unresolved mismatches remain alerted and cannot silently grant entitlement.

IntaSend's webhook guide describes challenge verification, out-of-order/replayed events and confirming important states through its API; the integration must follow the account's current documented contract. [IntaSend webhooks](https://developers.intasend.com/guides/webhooks/).

If two genuine payments settle for one invoice, allocate only one automatically; put the other into an audited unallocated-payment queue for owner-notified refund or explicit future credit. Never silently purchase another month. Partial/overpayments require reconciliation, not automatic activation. For an ambiguous STK request timeout, check status before creating another attempt; do not blindly retry a potentially successful external charge.

Subscription collection pays Sema. The platform does not hold or route a business's retail customer funds in MVP. Payment links for a merchant's orders require a later merchant-onboarding, permission, refund and payment-flow design.

### 8.5 Refunds, disputes and receipts

**Confirmed commercial policy:** Cancellation takes effect at the paid period's end; no routine prorated change-of-mind refund. Duplicate or confirmed erroneous money charges receive refunds; confirmed incorrectly counted answers receive auditable unit-credit corrections. Serious service complaints receive individual review; mandatory customer rights take precedence. Finance/Legal must verify published terms and provider-specific refund execution before sale.

Internal operating target: review complaints within two business days when founder capacity permits; published support remains appointment-based and best effort, without a fixed response guarantee. Authorized Finance approves refunds, records the provider result and notifies the owner. Do not promise settlement timing without method-specific confirmation. A documented credit-correction policy must preserve fair use of replacement units instead of silently changing ledger history.

Receipts identify legal seller, customer/workspace reference, invoice and provider references, amount/currency/tax treatment, purchased period/pack, date and status. Separate amount paid by the owner from processor fees/settlement. Reversal after activation creates an alert and reviewed entitlement adjustment; do not silently erase conversations or revoke unrelated fully paid periods.

### 8.6 Unit economics gate

For Starter, using the confirmed KES 2,500 base revenue and 1,000 included replies, a 70% recurring margin permits **KES 750 attributable recurring monthly delivery cost**. If a planning allocation of KES 250 covers recurring non-generation costs, KES 500 remains, or **KES 0.50 per included reply**. These are illustrative assumptions, not measured provider prices; actual tax/fee accounting, unrecovered processor costs, nonbillable attempts and recurring support affect that budget. Separately billed tax is not revenue; recovered processing fees must reconcile against provider costs without double-counting margin.

Standard assisted setup is included, so separately measure specialist intake, content preparation, installation and training time at a fully loaded hourly cost. Show first-month contribution including this cost and payback from subsequent paid contribution; proposed payback target is ≤3 paid months. Also track free-pilot setup/AI/support spend and actual conversion rate as acquisition costs. A free pilot with no revenue cannot be presented as meeting a paid recurring gross-margin target. Do not recover included standard setup through an undisclosed fee.

Measure p50/p95 tokens and retries, ingestion cost per source, storage, realtime connections, payment fees, recurring support effort and exchange-rate exposure. Stress-test a tenant using its entire allowance and abuse/long-context limits. Compare full Starter and top-up economics, not average under-use only. If the gate fails, reduce delivery/context cost, propose an explicit change to the confirmed offer for founder decision, or delay broad sale; do not silently change confirmed or sold entitlements.

## 9. Architecture and data contracts

### 9.1 Confirmed architecture and responsibilities

**Confirmed decision:** Next.js on Netlify Free, with Convex as Sema's primary backend. Convex replaces Neon Postgres/Auth/pgvector, Drizzle, PartyServer and Inngest in the application design. Retain IntaSend, Cloudflare Workers AI and Resend. This is a specification change, not a deployed migration; no repository, accounts or production data were supplied. Do not provision a second application database or realtime stack without a new demonstrated need.

| Layer | Current baseline / delegated implementation default |
|---|---|
| Frontend | Next.js App Router/TypeScript on Netlify Free; dashboard and isolated async widget. Server rendering/route behavior must be tested with the supported adapter. |
| Database and server API | Convex document tables, indexes, validated TypeScript queries/mutations/actions. Store canonical messages, knowledge, billing, entitlements and usage here; no SQL/Drizzle or assumed database foreign keys. |
| Staff identity | Recommended `@convex-dev/better-auth` integration with email/password, verified email, resets and session revocation; version/security/SSR spike required. Do not adopt native beta Convex Auth as an unqualified production dependency. |
| Authorization | Shared server helpers validate current staff session and membership, or scoped anonymous visitor token. Apply tenant/object/role checks to every exposed function, action, subscription, HTTP/file route and workflow. |
| Realtime | Authorized reactive Convex subscriptions for inbox/conversations; bounded pagination and presence state. No separate PartyServer. Business-hours and available-agent conditions still control live availability. |
| Retrieval | Convex vector and text indexes, active-corpus partitioning and exact-field fallback. Generate embeddings externally with the approved Workers AI adapter. |
| File storage | Convex storage for originals/exports, quarantined and served through authorized HTTP actions. Native file URLs are bearer URLs, not automatically expiring signed/private access. Public logos are separately approved assets. |
| Background work | Convex scheduling plus assessed Workflow component for ingestion/outbox/payment reconciliation/deletion sweeps. Persist job state, deadlines and idempotency keys; no separate Inngest. |
| Model APIs | Direct Workers AI REST candidate: `@cf/qwen/qwen3-30b-a3b-fp8` generation and `@cf/baai/bge-m3` embeddings. No paid fallback, payload logging or training opt-in. Bilingual quality/privacy gates remain. |
| Billing | IntaSend server-side M-Pesa initiation/status/webhooks; verified monetary effects allocated in transactional Convex mutations. |
| Email / observability | Resend Free, verified owned sender domain, durable notification state, redacted metrics/logs and quota/health alerts. Platform tooling does not create staffed 24/7 coverage. |

Convex documents its own reactive database and TypeScript function model; this intentionally replaces a Postgres architecture. [Overview](https://docs.convex.dev/understanding/overview). Component presence and free availability do not establish Sema-specific performance, privacy, recovery or production suitability.

### 9.2 Transaction, identity and tenant invariants

Queries/mutations must validate inputs and enforce current permissions. Use a mutation for all-or-nothing application database changes. Indexed checks inside that transaction enforce one accepted client turn, one reply deduction, one payment allocation and one winning agent claim; a Convex index is not a SQL uniqueness/foreign-key constraint. On retry, read and return the previously committed result. Concurrent requests must preserve invariants under mutation conflict/retry behavior.

Better Auth session validation and Sema membership checks are separate duties. Use the integration's session-validating helper in the appropriate backend context; do not assume a decoded identity alone proves the session is still active. Verify email before expensive imports/preview, require reauthentication for privileged changes, and test reset/revocation and open subscriptions. The integration guide's disabled-verification quickstart is not a production setting. Select supported patched versions at implementation, not an indefinitely frozen tutorial pin. [Next.js integration](https://labs.convex.dev/better-auth/framework-guides/next), [authorization](https://labs.convex.dev/better-auth/basic-usage/authorization), [email/reset settings](https://better-auth.com/docs/authentication/email-password).

Every tenant-owned document carries `organizationId`; related IDs must be loaded and checked against the same tenant and current actor. Never trust a client-selected tenant, corpus, amount, role, storage ID or conversation ID. Use internal functions for privileged workflow steps and expose only deliberately authorized entry points. There is no assumed automatic SQL RLS layer: shared authorization helpers, typed validators, scoped indexes and exhaustive cross-tenant negative tests are mandatory defenses.

Anonymous visitors receive server-issued expiring tokens bound to widget, allowed origin, conversation and permitted operations. They cannot invoke staff/admin functions or read internal notes/payment data. Public embed identifiers and room/document IDs are not secrets or authorization. Subscription responses must contain only visitor-visible data for that conversation; recheck revoked staff access and expired sessions within the specified ceiling.

### 9.3 Safe external calls and durable effects

Mutations cannot atomically transact with AI, IntaSend or email. Pattern: validate/reserve in a mutation → perform bounded external work in an action → finalize in a mutation after rechecking reservation expiry, entitlement, conversation mode, active source/corpus and deletion status. Do not hold a database transaction across network calls. Actions may fail after a side effect and are not automatically retried; blind retries of ambiguous payment initiation are prohibited. [Mutations](https://docs.convex.dev/functions/mutation-functions), [actions](https://docs.convex.dev/functions/actions).

For answers, atomically commit message, usage deduction and durable delivery/job state. A source deletion or human takeover rejects a stale candidate before commit. For payments, persist the callback safely, verify challenge/status/amount/currency/reference with IntaSend, then apply a single allocation mutation keyed to provider/environment/resource. Record corrections rather than overwriting financial history. Network delivery is at least once; business effects are idempotent.

Workflow steps carry IDs and small state, not copied full transcripts/files. Reload current tenant/permission/deletion state at execution. Use bounded retries/backoff only for safe operations, periodic reconciliation/deletion sweeps, dead-letter inspection and idempotent external keys. Store enough application job state to reconstruct pending work after restore; scheduler metadata alone is insufficient. [Workflow component](https://www.convex.dev/components/workflow).

### 9.4 Logical data model and retrieval partitioning

| Entity group | Required invariants |
|---|---|
| Organizations, memberships, invitations | Verified auth subject, role, membership version, expiration, one member/workspace pair checked in mutation; at least one owner |
| Widget configuration, allowed origins, hours | Versioned safe public fields, verified production-domain control, timezone/holidays, readiness and go-live timestamp |
| Sources, source versions, chunks, corpus versions | Tenant, checksum, extraction/approval/deletion states, page/section provenance, embedding schema/dimension, active corpus and version-specific preview |
| Conversations, messages, assignments, notes | Tenant/visitor scope, mode/version, idempotent client turn, ordered message cursor, author/visibility, atomic claim; notes never in visitor payloads |
| Plans, prices, subscriptions, entitlements, top-up packs | Immutable purchase quote, versioned pilot enrollment/eligibility acceptance, service boundaries, original 90-day pack expiry, unit balances and role-controlled actions |
| Invoices, attempts, payments, allocations, refunds, credits | Provider/environment/resource deduplication, expected/verified amounts, tenant identity, append-only corrections |
| Usage, cost, reservations | One billable turn effect, allowance bucket, reservation expiry, integer quantities and internal cost metadata |
| Webhook inbox, delivery outbox, jobs, audit, privacy requests | Stable keys, state/attempts, scoped actor, minimal payload, deadlines, deletion tombstones and replay controls |

Convex vector search runs in actions and supports indexed equality/OR filtering. Derive a composite `retrievalScope` from authorized organization plus the snapshotted published corpus/version and use it for prefiltering. Fetch resulting documents through internal checks for tenant, source eligibility, deletion and current corpus; repeat eligibility checks at answer commit. Retrieval and later reads are not one transaction. Never send a cross-tenant chunk to a model, even if it would be discarded afterward. [Vector search](https://docs.convex.dev/search/vector-search).

Match the vector index dimension to the embedding version. Re-embed side by side and switch the corpus pointer atomically; never mix incompatible vectors. Combine vector candidates with bounded full-text/exact factual retrieval and evaluate cross-language recall. Search-index capacity and query cost must be measured; a tenant filter does not make a global index's resource cost disappear. Partition/cache keys include tenant/corpus/model version.

### 9.5 Immediate self-service, private files and abuse controls

Public registration and expensive workflows are available without a founder scheduling gate. Automated checks still require verified email, eligible use declaration, accepted notices, bounded file/URL validation, owner preview/publication and proof of production-domain control before go-live. Ambiguous/ineligible sector cases receive a clear eligibility outcome; do not silently activate prohibited workflows. Assistance afterward is optional and appointment-based.

Apply per-user/network/workspace and global budgets before upload, extraction, embedding, preview and generation. Reserve storage/index capacity before admitting work, verify actual size/type after transfer, quarantine unsupported content and remove abandoned objects. Do not expose an unrestricted upload capability that bypasses enforced byte/type limits. New public workspaces cannot collectively exhaust all storage or AI allowance unnoticed. Initial delegated limits are in §4.2; set platform soft ceilings below the provider caps and reserve space for billing, deletion and recovery.

Original sources and exports use authorization-checked HTTP serving with tenant/file relationship checks on every request. Do not return direct `storage.getUrl()` originals as a substitute for private signed URLs. Exports expire after 24h through application policy; revoked/deleted files cannot still be served by an old link. Citations expose approved excerpts only; logos explicitly approved for public widget display are separate. [Serving files](https://docs.convex.dev/file-storage/serve-files).

Use structured safe error codes, request IDs and retry/reset guidance. If quota is temporarily exhausted, explain that resource limit; do not fabricate a founder-approval queue. New users may retry when capacity returns. No paid upgrade, automatic top-up, paid model or account billing fallback is authorized by the free-tier preference.

### 9.6 Verified free-plan constraints and evidence gates

Checked against official sources on 15 October 2026. These are plan facts and engineering choices, not a deployed capacity or compliance claim.

| Service | Current facts and required response |
|---|---|
| Convex Free | Hard-capped Free is distinct from usage-billed Starter. Free includes 1M function calls/month, 20 GB-hours actions, 0.5 GB DB, 1 GB DB I/O, 1 GB files/backups and 0.5 GB shared search indexes. Scheduled work, subscriptions and file access consume allowance. New writes can fail at caps. Retain Free; monitor actual usage and stop safely before limits. [Limits](https://docs.convex.dev/production/state/limits), [pricing](https://www.convex.dev/pricing) |
| Convex terms / auth | TOS §4.4 permits customer-facing embedding on designated serverless types; no Free-specific commercial prohibition was found in the rendered TOS, but actual Free plan/order eligibility remains to verify. Designated beta production use is restricted; native Convex Auth is beta and excluded as the default. Better Auth integration remains subject to security/compatibility checks. [TOS](https://www.convex.dev/legal/tos), [auth status](https://docs.convex.dev/auth/convex-auth) |
| Convex data / recovery | Selected regions include Virginia, Ireland, Sydney and Canada Central. Free manual backups are limited and do not include code, environment configuration or pending scheduled jobs. DPA archive/backup deletion follows an unspecified schedule; obtain its maximum before promising a bounded vendor purge. Kenya transfer compliance is not established by EU clauses. [Regions](https://docs.convex.dev/production/regions), [backups](https://docs.convex.dev/database/backup-restore), [DPA](https://www.convex.dev/legal/dpa) |
| Netlify Free | Commercial use/Next.js support is documented; 300 hard-capped credits/month, with all account projects potentially paused at exhaustion. Prove supported deployment workflow, budget production deploys and runtime/traffic, and never enable paid recharge silently. [Commercial use](https://www.netlify.com/guides/netlify-vs-vercel/), [plans](https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/credit-based-pricing-plans/), [Next.js](https://docs.netlify.com/build/frameworks/framework-setup-guides/nextjs/overview/) |
| Workers AI | Free has 10,000 neurons/day reset at 00:00 UTC, hard failure at its limit and paid-model exclusions. Candidate generation and multilingual embeddings are available; Sema's bilingual quality/actual answer capacity remain unproven. [Pricing](https://developers.cloudflare.com/workers-ai/platform/pricing/), [Qwen](https://developers.cloudflare.com/workers-ai/models/qwen3-30b-a3b-fp8/), [BGE-M3](https://developers.cloudflare.com/workers-ai/models/bge-m3/) |
| AI data handling | Cloudflare documents no model training/improvement without explicit consent, but the retrieved source does not establish precise inference-only retention. Use direct REST without payload logging/training opt-in; verify processing, DPA, transfer, erasure and model licenses before personal data. [Data use](https://developers.cloudflare.com/workers-ai/platform/data-usage/), [gateway logging](https://developers.cloudflare.com/ai-gateway/observability/logging/) |
| Resend Free | 3,000 transactional messages/month and 100/day. Verify owned sender domain; separate essential auth/billing/handoff notifications, deduplicate/throttle, and keep durable state in Convex. Mail failure cannot erase a handoff. [Pricing](https://resend.com/pricing), [terms](https://www.resend.com/legal/terms-of-service) |

Reserve headroom and alert at 50/75/90% of vendor consumption. Keep serving, ingestion and offline evaluation budgets separate; batch evaluations across quota resets if necessary. App failure at a free host cap can make even its widget fallback unavailable, so each customer must retain a working contact route on their own website outside Sema. Free tier does not imply a contractual uptime/recovery SLA.

No positive recurring vendor budget, paid upgrade or spend has been approved. Domain costs, founder time, legal review and transaction fees are separate economic inputs. If public demand exceeds free capacity, pause affected resource operations transparently, stop new live admissions if necessary and bring a funding/scope decision to the founder; do not weaken safety or silently charge. Registering does not guarantee uninterrupted resources.

### 9.7 Required implementation proofs and superseded choices

Before live customer data: verify Better Auth signup/email/reset/revocation and membership isolation; anonymous visitor sessions and subscription privacy; atomic claim/quota/message/usage/payment mutations; cross-language retrieval; upload/extraction and authorization-checked serving; immediate source removal; workflow crash/replay; retention/backup deletion; restore including identity/financial/job state; deployment/quotas and actual latency from Kenya. Record versions, conditions, evidence and residual limits. No such implementation tests have been performed during PRD refinement.

Follow provider-authorized test practices. Convex TOS restricts specified platform benchmarking/testing without written consent: confirm the allowed scope before synthetic load, infrastructure benchmarking or security testing of its hosted platform. Use documented unit/application-testing tools and ordinary functional verification; this is not a blanket claim that normal application tests are prohibited. Do not perform restricted hosted testing or contact providers on the user's behalf under this document task. [TOS](https://www.convex.dev/legal/tos).

Historical context: the original Neon/Drizzle/pgvector design and briefly accepted PartyServer replacement are superseded by the user-confirmed Convex decision. Vercel Hobby's commercial restriction and hosted PartyKit's announced shutdown explain the retained Netlify choice; they are not current Sema runtime dependencies. [Vercel fair use](https://vercel.com/docs/limits/fair-use-guidelines), [PartyKit shutdown](https://blog.partykit.io/posts/hosted-platform-shutdown).

## 10. Security and privacy

### 10.1 Trust boundaries and security controls

Security requirements apply to the widget, staff dashboard, APIs, model calls, object storage, job runner, realtime service and payment callbacks—not only the database.

| ID | Control | Required verification |
|---|---|---|
| SEC-01 | Tenant and visitor isolation | Two-tenant negative tests cover IDs, joins, vectors, caches, sockets, files, exports, notes, jobs and support tools. No unauthorized reads, writes or metadata leaks. |
| SEC-02 | Sessions and privileged access | Secure/HttpOnly staff cookies where applicable, CSRF protection, origin validation, session expiry/revocation and reauthentication for billing/member/export/delete changes. Enforce MFA for production operators through the selected supported identity/access path. |
| SEC-03 | Secrets and environments | Vendor credentials only in approved secret stores; least-privilege keys, rotation and redaction. Separate sandbox, preview, staging and production accounts/config. Preview deployments cannot send production alerts, charge live payments or access production content. |
| SEC-04 | Stored and transmitted data | TLS on public/service paths; verify at-rest controls for DB/files/jobs/backups. Authorize originals/exports on every HTTP request and enforce application expiry; native bearer file URLs are not private signed access. No unverified encryption/retention claim. |
| SEC-05 | Browser and content safety | Escape messages and source titles, sanitize any rendered markup, allow safe protocols only, use iframe isolation/CSP and validate `postMessage` origin/source/schema. No arbitrary script or model-generated executable HTML. |
| SEC-06 | Ingestion and SSRF defense | Accept authorized public HTTPS URLs only; block credentials, localhost, private/link-local/reserved IPs, cloud metadata and unsafe ports. Recheck DNS/addresses and every redirect at connection time. Defend against rebinding, decompression bombs and DOCX zip bombs; restrict parser CPU/memory/network and malware-scan uploads. |
| SEC-07 | Abuse and cost protection | Rate-limit workspace, visitor/session and network signals before model calls; use privacy-limited network identifiers. Initial guardrails: 6 turns/minute/session, 60/minute/workspace, plus §4 concurrency and global spend breakers. Progressive challenges for suspicious activity; not a mandatory CAPTCHA for all visitors. |
| SEC-08 | AI boundary | No tools with financial/account-changing authority in MVP. Retrieved instructions cannot override platform policy. Prevent secret/PII disclosure in model input/output; validate citations and test indirect prompt injection. |
| SEC-09 | Supply chain and deployment | Pin supported dependencies, scan builds/secrets, review production changes, protect deployment credentials and remediate critical/high exploitable findings before launch. Review a third-party embed as code executed on customers' sites. |
| SEC-10 | Operator support access | No routine unrestricted customer browsing. Time-limited access with reason, approved scope and audit; customer authorization unless incident/legal obligations require otherwise. Periodically review access and never train on support transcripts by default. |

Domain allowlists and CORS reduce casual embed misuse but do not authenticate arbitrary Internet clients. Tokens, tenant authorization, rate limits and budget caps remain mandatory. Prompt engineering is not an isolation or secret-management control.

### 10.2 Privacy responsibilities and legal launch gate

**Proposed role mapping:** A business usually determines the purpose of its visitor-support processing and acts as controller; Sema usually processes that content on its behalf. Sema separately determines purposes for its own staff accounts, billing, fraud/security and business administration. Document actual roles and subprocessors in a data-processing agreement (DPA); do not assume one role covers every data flow. ODPC describes controller/processor roles and compliance oversight. [ODPC compliance guidance](https://www.odpc.go.ke/data-protection-compliance/).

Before processing real visitor data, the Privacy Lead and Kenyan legal adviser must approve:

- Controller/processor mapping, lawful basis for each purpose, notice wording, visitor rights process and DPA/instructions.
- ODPC registration analysis for Sema and customer obligations; small-business status is not an automatic exemption. ODPC registration guidance includes thresholds and categories that must register regardless of size. [ODPC registration guidance](https://www.odpc.go.ke/wp-content/uploads/2024/02/ODPC-Guidance-Note-on-Registration-of-Data-Controllers-and-Data-Processors.pdf).
- Data map and transfer assessment covering hosting region, model inference, auth, realtime hosting, storage, email, jobs, monitoring, backups and remote operator access. Record actual locations, recipients, terms and appropriate transfer safeguards. Do not promise Kenyan data residency, blanket consent sufficiency or a universal localization rule.
- DPIA screening and a documented DPIA where required; separately assess sensitive data, children and later regulated use cases. Excluding these customers reduces scope but does not remove obligations for incidental personal data.
- Statutory breach-notification triggers, recipients and deadlines; data-subject request timelines; retention, deletion exceptions and tax/accounting requirements. Verify the current Act/regulations and applicability with counsel. Primary Act retrieval was blocked during this review; §16.2 records the limitation.

This PRD does not certify compliance. The product must not claim SOC 2, ISO certification, HIPAA suitability or regulatory approval because a vendor has a certification.

### 10.3 Data minimization and consent

Collect no contact information for ordinary FAQ answers by default. For follow-up, explain what will be collected, why and who responds; separate support permission from any marketing permission. Do not automatically add a visitor to marketing lists. A notice acknowledgement is not blanket consent for all processing; use the lawful basis approved for each purpose.

Never ask for payment PINs, OTPs, passwords, full card details, national IDs, medical records or children's personal data. Detect/redact likely secrets and sensitive identifiers before provider calls/logging where feasible; warn users and provide human contact without soliciting more sensitive content. Redaction is imperfect: document residual risk and restrict access to any original message that must be retained.

Only the minimal relevant approved chunks and bounded recent conversation context may be sent to the selected AI/embedding providers. Require contractual/API data terms covering training use, retention, deletion and incident response; do not assume “no training” means “zero retention.” No cross-tenant model training, shared prompt memory or reuse of customer content for marketing. An alternate provider requires its own approved terms and evaluation before routing traffic.

### 10.4 Retention and deletion — confirmed conversation default and proposed supporting schedules

The user has confirmed the 90-day conversation default, owner-selectable 30-day option and earlier deletion controls. Inactive-workspace content erasure and separate unexpired-credit preservation are also confirmed. Supporting diagnostic, backup and statutory financial schedules remain proposed or evidence-dependent unless stated otherwise. All require privacy/legal review and actual vendor feasibility evidence under O05 before real data. Enforce approved schedules in jobs/storage lifecycle policies and monitor purge completion.

| Data | Proposed lifecycle | Deletion behavior |
|---|---|---|
| Conversation text, contact details, notes, feedback and linked gap excerpts | Confirmed: 90 days from last conversation activity; owner may shorten to 30 days or request earlier deletion | Remove content and linked personal data from serving stores within 24h of expiry/approved erasure; keep only genuinely anonymized counts if justified |
| Active approved knowledge/raw files | Until owner replaces/deletes or workspace is erased | Immediately block retrieval/public citation access; purge raw files, extracted text, chunks, vectors, excerpts and caches within 24h |
| Superseded knowledge | Up to 30 days for rollback unless deletion requested | Never retrieve as active; erase on schedule; no rollback after erasure |
| Failed/quarantined uploads | ≤7 days, restricted access | Automatic purge; retain non-content error metadata only |
| Never-activated preparation workspace | Delegated default: erase prepared content after 30 days without authenticated owner activity; preview traffic cannot extend it | Show the expiry in the dashboard and attempt warnings 7 days and 1 day before purge. Preserve minimal eligibility/financial records only where justified; this never resets a prior pilot or changes an activated workspace's confirmed retention. |
| Retrieval traces | IDs/metrics ≤30 days; no duplicate full text by default | Remove evidence payloads with parent data; keep non-identifying aggregate metrics only |
| General diagnostics | 30 days; redacted and content-free | Automatic purge; no unrestricted full-conversation logging |
| Security/audit records | 180 days proposed, minimized | Retain actor/action/object references without erased content; restrict access and review necessity |
| Exports | 24 hours | Expire link and erase export object; export generation cannot resurrect deleted sources |
| Expired paid/free-pilot workspace access | Confirmed: 30-day read-only inbox/export window after paid human grace or pilot expiry | No live chat or content writes during read-only state. At window end erase workspace content, preserving only minimal payment/unexpired-credit records; earlier requested erasure follows privacy process. |
| Financial/statutory records | Exact minimum retention and legal basis set by Finance/Legal before paid launch | Segregate invoices/payment records from support content; retain only legally necessary fields and purge at approved end date |
| Backups | Maximum 30-day rolling content retention, subject to vendor verification | Deleted content ages out; restore procedure reapplies tombstones before serving traffic |

An erasure request first disables use/access and propagates a tombstone to jobs/caches/providers. Serving-system erasure target is 24h after identity/authority is verified and scope approved; processor propagation target is ≤7 days; backup copies expire within the disclosed ≤30-day window. Disclose any verified vendor retention or legal-hold exception before onboarding; if a required limit is unavailable, change vendor/configuration or revise and approve the policy before launch.

Distinguish ordinary unpublication/source removal from privacy erasure. Ordinary source removal stops future use and deletes stored source/citation evidence; previously communicated answer text follows conversation retention, which the owner must be told. If removal concerns personal/sensitive information or an erasure request, use provenance to redact or delete affected historical answer text, excerpts, gap records and traces too; do not retain a generated copy of erased information as a workaround.

Log deletion request ID, scope, time, systems and completion without preserving the erased content. Verify backups cannot silently reintroduce it. Retain minimal tombstones long enough to cover backup expiry. Financial/legal holds are scoped, justified and communicated where permitted; they do not justify keeping all chat content. Do not describe pseudonymized event data as anonymous if reidentification remains possible.

### 10.5 Rights and incident handling

Publish privacy/support contacts and provide authenticated owner export, correction and deletion controls. A visitor may have no staff login: verify their relationship to the conversation using the scoped session or a carefully reviewed alternative, route the request to the controller, and never reveal another person's transcript based only on a supplied phone/email. Track due dates using the approved legal matrix.

On suspected personal-data exposure, contain access, preserve minimal forensic evidence, identify affected tenants and processors, and involve the incident/privacy leads immediately. Proposed internal target: notify the affected business/controller without delay and aim within **24 hours of awareness**; this is an internal operating target, not a statement of the statutory deadline. Counsel determines regulatory/data-subject notices and applicable timing. ODPC provides a formal breach-reporting process under section 43. [ODPC breach reporting](https://www.odpc.go.ke/report-a-data-breach/).

## 11. Nonfunctional requirements

All targets below are proposed internal release criteria, not contractual SLAs. Measure at the supported workload and disclose external dependency effects. Do not advertise an uptime guarantee until operational evidence and contractual support exist.

| ID | Requirement / proposed target | Measurement and gate |
|---|---|---|
| NFR-01 | Core public service availability ≥99.5% per calendar month | Synthetic widget bootstrap + message persistence + answer-or-fallback checks from Kenya and one external region every minute; report AI availability separately so fallback cannot hide AI outages. Show total end-to-end failures, including dependency incidents; annotate causes. |
| NFR-02 | Message acknowledgement p95 ≤1 second; validated answer p95 ≤10 seconds and p99 ≤20 seconds | Browser-to-visible response from Nairobi on representative mobile connectivity. Record warm/cold, network, retrieval and provider contributions. At 15-second generation timeout, offer fallback/handoff by 20 seconds; no unbounded spinner. |
| NFR-03 | Small supported source ingestion p95 ≤5 minutes | Test supported text documents from 0.1–2 MB and up to 50 pages, bounded by the extraction/chunk limits, plus supported URLs at pilot concurrency. Test oversized inputs for prompt rejection rather than successful ingestion. Display queued/extracting/indexing state immediately; alert on >15-minute jobs. |
| NFR-04 | Delegated pilot baseline: 5 simultaneous AI generations and 50 realtime connections across up to 5 test tenants | Use authorized functional/concurrency checks and documented application-test tooling; obtain any required provider consent before hosted synthetic load or benchmarking. Throttle safely on overload. The prior 50-generation/500-connection target is a future capacity milestone, not an assertion about free-tier readiness. |
| NFR-05 | Lightweight, nonblocking embed | Loader ≤30 KB gzip; defer iframe/UI until open or idle; UI assets ≤200 KB gzip initial load excluding customer logo. No host-render blocking, host scrolling breakage or layout shift caused by widget. Measure representative storefronts. |
| NFR-06 | WCAG 2.2 AA target for dashboard and widget | Automated audit plus manual keyboard, focus trap/return, zoom, contrast and screen-reader checks. Announce responses without stealing focus; touch controls work on small screens. Accessibility claim requires evidence. |
| NFR-07 | Supported clients | Latest two stable Chrome, Edge, Firefox and Safari versions at release; Android Chrome and iOS Safari on 360px+ widths. Cross-site storage restrictions must not cause data exposure; if persistence is unavailable, use an in-memory session with explicit history limitation. |
| NFR-08 | Prove pilot backup/export/restore and disclose achieved recovery bounds; engineering design target is a daily recovery point. Future public-service target remains RPO ≤1h / RTO ≤4h after proof/funding. | Convex Free manual backups and excluded pending-job/configuration state do not prove these goals. Before real data, test identity, ledger, files and deletion-tombstone recovery and document actual limits. No contractual recovery SLA at pilot; do not waive privacy/ledger correctness. |
| NFR-09 | Durable data and concurrency | No acknowledged message loss in process-crash/replay tests outside declared disaster RPO; no duplicate charges or quota effects. Database constraints and outbox/reconciliation tests prove invariants. |
| NFR-10 | Security release quality | No unresolved critical/high exploitable issues in the scoped review; all SEC controls and tenant-negative tests pass. Record residual lower risks with owner and due date. |
| NFR-11 | Operability and diagnosability | Every request/job/payment gets a correlation ID; logs redacted. Alerts cover safety, payment mismatch, job backlog, error/latency and spend. Dashboard identifies affected dependency without exposing customer content. |
| NFR-12 | Cost and fair resource use | Per-tenant/global model spend and ingestion limits enforce caps before costly work; full-allowance margin gate passes. One abusive tenant cannot exhaust all platform concurrency. |

Report performance with device, geography, network, test data and load conditions. A local developer benchmark does not establish Kenyan visitor performance. Cache invalidation after unpublish/delete and member revocation must meet the explicit 60-second access-stop ceiling; new answer commits must recheck immediately.

## 12. Operations and incident response

### 12.1 Ownership and support

**Confirmed operating model:** The founder personally provides Sema setup/product support through scheduled appointments and best-effort asynchronous support, with no fixed daily service window. Product, engineering, quality, privacy and billing accountability therefore rests with the founder unless qualified help is explicitly engaged. Do not invent a staffed team or backup. Businesses remain responsible for answering their own visitors. Publish the appointment/contact route and distinguish automated availability from human coverage. Qualified legal/bilingual review and tested incident controls remain launch prerequisites; sole operation does not waive them.

| Severity | Examples | Proposed response during active coverage / escalation |
|---|---|---|
| P0 | Cross-tenant disclosure, secret leak, unauthorized financial effect | Immediately alert the founder and activate safe automatic access/AI blocks where applicable; preserve minimal evidence. Human handling is best effort; no staffed 15-minute or 24/7 response promise. Agree an incident contact before pilot and verify breach-notification process separately. |
| P1 | Broad chat failure, billing activation failure, severe answer regression | Alert founder, pause/rollback safely and provide verified-impact updates when available. No guaranteed 30-minute human acknowledgement under appointment-only pilot coverage. |
| P2 | Single-tenant ingestion error, delayed notification, noncritical defect | Track and address asynchronously or at the agreed appointment; measure turnaround without promising a fixed business-day SLA. |

Alert thresholds: sustained error rate >2% for 5 minutes, p95 answer latency >10 seconds for 10 minutes, queue age >15 minutes, any verified payment mismatch, any unexpected paid route/charge or imminent shared free-quota exhaustion, or any confirmed critical AI/privacy failure. Tune for observed traffic; low volume may require direct event alerts instead of percentages.

Runbooks must cover model outage, database/realtime loss, stuck ingestion, expired quota leases, missing/out-of-order callbacks, duplicate payments, mistaken publication, unsafe answer, erasure, credential compromise and disaster restore. Email failure never removes the inbox's handoff record. AI outage degrades to the human route; database outage can show static support contact but must not claim that a message was saved.

### 12.2 Deployment and rollback

Use separate Convex development/preview/production deployments with synthetic or approved de-identified data. Never copy real auth state, visitor content or live payment secrets into routine previews. Version schemas/indexes/functions and use additive changes/backfills with rollback compatibility. Export data/files and preserve code/configuration/job reconstruction separately; native backups do not cover every part of the application.

Deploy backward-compatible schema expansion first, app changes second and cleanup only after rollback compatibility is established. Feature flags control live AI, language, ingestion types, billing and future channels per tenant. Keep previous safe model/prompt/corpus versions available unless erased. A kill switch must prevent new AI commits, not merely hide the UI. Test rollback and job version compatibility before launch.

Run restore and payment-replay drills before paid launch and at least quarterly afterward. After a serious incident, complete a blameless review with cause, affected data/payments, corrective actions and owners. Customer communications must reflect verified impact; never claim no exposure before investigation supports it.

## 13. Validation, rollout and release gates

### 13.1 Discovery and commercial validation

Interview **15–25 businesses** and closely observe a representative group of **3–5 design partners** while public self-signup remains open. This observation sample is not an invitation-only registration cap. Record support-channel distribution, question volume, cost/time baseline, after-hours losses if evidenced, willingness to pay, knowledge readiness, agent staffing and included setup effort. Self-service activation must not wait for founder availability. Offer optional included assistance appointments; publish best-effort status without blocking automated readiness. Apply transparent resource limits, identity/eligibility controls and cost monitoring to public signups. Request redacted samples; avoid collecting customer records merely to conduct discovery.

Test website-first positioning and the confirmed KES 2,500 offer with demos/landing material that labels planned features. Run the confirmed free 30-day pilot with included assisted setup. Free enrollment measures interest and usability; willingness to pay remains unvalidated until businesses explicitly convert and make verified Starter payments, including permitted early conversions. Compare quality and human effort with the business's existing workflow. Do not infer demand from the existence of local competitors or one competitor's public price.

If most qualified prospects need WhatsApp and have insufficient website traffic, revisit the channel decision before overbuilding website features. A channel pivot requires refreshed policy, cost, consent, onboarding and delivery gates; it is not a silent expansion of MVP.

### 13.2 Gated rollout

| Gate | Exit criteria | Accountable decision |
|---|---|---|
| G0 — discovery complete | A01 tested and A02 pricing/conversion intent recorded; ≥3 service businesses commit to the free pilot, supplying knowledge and human contacts; share post-pilot Starter terms without requiring payment | Founder / Product |
| G1 — architecture and data readiness | Stack spikes pass; model/storage/jobs/email selected; region/vendor/data map, DPA, registration/DPIA screening and privacy schedule approved; threat model reviewed | Engineering + Privacy |
| G2 — internal alpha | FR happy/failure paths pass using synthetic data; English and Swahili held-out evaluation gates pass; tenant/security and billing sandbox suites pass; safe degraded mode proven | Engineering + AI + QA |
| G3 — free 30-day live pilot | Public self-signup with immediate self-service imports/preview/activation after automated checks, optional assistance afterward, closely observed partners, per-tenant flags, reviewed public-safe corpus, named agents, privacy notice, confirmed 100-reply free quota and exact go-live/expiry dates; operator runbooks/alerts active. Verify payment/refund plumbing using an authorized test workspace, without charging pilot businesses. | Product + Service + Finance |
| G4 — controlled pilot conversions / paid beta | Before accepting the first real Starter purchase, pass bilingual quality, tenant/privacy, billing/reconciliation/refund, deletion/export, recovery, provider-terms and applicable NFR checks; publish approved tax/fee/refund terms and verify full-allowance economics and included-assistance payback. No unresolved critical incident. Each converting owner explicitly chooses Starter at pilot end or earlier. Enable controlled conversions only after these prerequisites; payment counts are then collected as evidence for G5. | Founder + Engineering + Privacy + Finance |
| G5 — broad paid Starter launch | At least **two distinct pilot businesses** explicitly purchase Starter and have verified settled, non-refunded payments, matched to separate eligible workspaces; exclude founder/test accounts, top-up-only payments and duplicate payments from one business. All G4 prerequisites remain passing; ≥100 audited substantive pilot answers across the cohort, extending observation if volume is insufficient; all launch P0/P1 defects closed; founder support process and installation/help docs ready. Review bilingual quality, handoffs, quota/cost evidence and remaining risks. Two payments are a minimum evidence gate, not proof of broad market fit. | Founder |
| G6 — WhatsApp expansion | Separate channel requirements, current Meta/BSP policy and Kenya rate validation, account onboarding, consent/templates/window enforcement, webhook/security/delivery tests and channel margin model pass | Product + Engineering + Privacy + Finance |

Distinguish enabling controlled pilot conversions at G4 from approving broad rollout at G5: the first two payments can occur during controlled beta once the prerequisite checks pass. Never require those two payments before enabling the first conversion. Public self-service remains the activation flow; enforce tested resource capacity transparently without a founder approval queue. Review operations and measured load around 10, 25 and 50 active paid workspaces as engineering expansion checkpoints, not promises that free tiers can support those numbers. Initial free enrollment closes through the versioned offer control; existing pilots keep their promised terms and later customers pay before go-live. Do not require 70% month-2 retention before the product has had two renewal cycles; evaluate that target when cohorts mature. Early retention evidence informs expansion, while safety gates apply immediately.

Stop admissions or disable the affected feature for a critical privacy/payment error, failed quality gate, unresolved P0/P1, an unreconciled ledger inconsistency, or sustained NFR breach. Resume only after a verified fix/regression test and accountable sign-off. Keep human channels and exports available where technically safe.

### 13.3 Release evidence checklist

- Trace every FR/SEC/NFR to an owner, implementation issue and test result; run tenant isolation, source deletion, human/AI race, duplicate/reconnect and forged/out-of-order payment scenarios.
- Archive held-out RAG scores, raw counts, bilingual review where enabled, model/prompt/corpus versions and sampled production review results.
- Record performance/load conditions, device/browser/accessibility QA, backup restore timing, erasure propagation and dependency failure exercises.
- Reconcile pilot invoices, provider collections, credits and usage; verify receipts and owner notices.
- Verify initial-pilot enrollment closure, preservation of accepted pilot periods and later paid-before-go-live enforcement. Archive two distinct eligible pilot businesses' verified Starter purchase records for G5 without exposing payment details publicly.
- Publish installation, knowledge approval, troubleshooting, appointment/contact arrangements, privacy, DPA, billing/refund and incident-contact material.
- Obtain role-based sign-offs for applicable gates. A completed code backlog alone is insufficient for release.

## 14. Risks and mitigations

Likelihood and impact ratings below are planning judgments, not quantified probabilities.

| Risk | Likelihood / impact | Early signal | Mitigation / owner |
|---|---|---|---|
| Wrong or unsupported answer damages trust | High / high | Corrections, unsupported claims, complaint spike | Evidence checks, owner approval, held-out eval, human path, per-tenant pause; AI Lead |
| Cross-tenant or public/private knowledge disclosure | Medium / critical | Negative test failure, unsafe upload, unexpected citation | Per-function tenant/role checks, scoped subscriptions/tokens, typed validators, public-safe publication and security review; Founder |
| Website-first product lacks enough traffic | High / high | Few genuine widget questions despite activation | Validate channel mix, interview conversion, reconsider sequencing at G0; Product |
| Knowledge stale, sparse or contradictory | High / high | Repeated no-evidence/conflict reasons | Preview questions, reviewed versioning, owner review reminders, knowledge-gap list; Customer Success |
| Unit economics fail at full allowance | Medium / high | Rising context/retry/support cost | Cost ledger, token limits, spend caps, reprice before sale; Finance + Engineering |
| Payment ambiguity or fraud grants wrong access | Medium / high | Unmatched collections, callback anomalies | Provider lookup, amount/reference match, unique allocation and daily reconciliation; Billing Owner |
| Human handoff is unattended | High / medium | Aging waiting queue, visitor complaints | Named staff/hours, honest away copy, minimal alerts and visible queue age; Customer Success |
| Prompt injection or public endpoint abuse | High / high | Policy violations, token/cost bursts | Untrusted-context boundary, no financial tools, rate limits, adversarial tests; Security + AI |
| Privacy, transfer or retention obligations unmet | Medium / high | Missing DPA/vendor terms or deletion failure | Legal/data map gate, limited launch sectors, measured deletion and approved transfers; Privacy Lead |
| Vendor outage, account limit or product change | Medium / high | Timeouts, rejected calls, vendor notices | Human fallback, queue recovery, rate provisioning, documented replacement plan; Service Owner |
| WhatsApp policy/pricing alters economics | High / high for expansion | New fees, template rejection, account restrictions | Keep launch website-first; verify primary policy before G6; separate channel budgets/entitlements; Product + Finance |
| Small pilot overstates quality/retention | High / medium | Wide uncertainty, inconsistent slices | Publish counts, extend observation, separate paid/assisted cohorts; Product |
| Public-signup/support abuse consumes resources | High / high | Repeated accounts, upload/preview bursts, growing setup queue | Verified identity/domain controls, one pilot per business, immediate self-service with automated checks, global preview/ingestion budgets and truthful quota/retry status; Founder |
| Scope and staffing exceed delivery capacity | High / high | Slipping critical path, many incomplete integrations | One paid plan, explicit exclusions and gate-based roadmap; Founder + Engineering |
| Working-name conflict | Unknown / medium | Trademark/domain collision or confusing customer feedback | Kenya-focused legal/name/domain clearance before branding spend; Founder |

## 15. Roadmap and decision register

### 15.1 Sequencing — indicative, dependent on staffing and gates

| Phase | Indicative timing from kickoff | Deliverables and dependency |
|---|---|---|
| Validation | Weeks 1–4 | Interviews, partner commitments, source samples, channel/price tests, draft eval set; G0 |
| Foundation and MVP build | Following ~8–12 engineering weeks | Architecture spikes, identity/isolation, knowledge pipeline, widget, RAG, handoff, billing/ledgers, privacy/operations; G1/G2. Estimate after staffing and backlog decomposition. |
| Public self-service pilot and paid beta | Following ~2–4+ weeks | Public signup/imports/preview/activation with optional help afterward; observe 3–5 representative businesses, measure quality/quotas/conversion and verify collections/recovery; G3/G4. |
| Public Starter | When G5 passes, including two verified pilot-business Starter conversions | Public self-service preparation/preview continues; later customers pay Starter before live activation. Free offer is initial-pilot-only, with enrolled periods preserved. Optional included assistance afterward, business-managed FAQ/gap workflow and verified billing. Enforce resource limits transparently; no founder scheduling gate. |
| Local expansion | Roughly months 4–7, if validated | WhatsApp after G6; stronger Swahili coverage; possible CRM export and read-only scheduling/CRM information, if pilot demand supports it. Reprioritize based on paid demand. |
| Broader scale | Roughly months 7–12+, after retention/economics evidence | Multi-seat tiers, agency management, approved integrations and automation; enterprise SSO/audit/SLA only with actual capability and support |

The original weeks 5–12 build and months 3–5 expansion overlapped. This sequence makes dependencies explicit; it is not a delivery commitment. Defer hosted help center, native apps, voice, full omnichannel, custom workflow builder, autonomous payments, marketplace and regulated-sector expansion until demand and readiness warrant them.

**WhatsApp expansion scope:** Business account/number onboarding and permissions, inbound routing to the same inbox, allowed reply-window enforcement, approved template/opt-in handling, delivery receipts, retries/deduplication, human takeover, opt-out handling, per-channel metering and transparent Meta/BSP costs. Investigate whether account/number coexistence and hosting options meet each customer's actual setup. A “Continue on WhatsApp” outbound link can precede native integration, but must be labeled as leaving the website chat; no automatic transcript transfer or shared-history promise.

**Order/booking expansion:** Begin with read-only status, authenticated visitor authorization and least-privilege merchant credentials. Later write actions need explicit confirmation, idempotency, authorization, audit, cancellation/refund and failure recovery. A knowledge-grounded answer engine alone cannot safely execute these workflows.

### 15.2 Evidence gates and deferred expansion decisions

| ID | Confirmed requirement / remaining evidence | Owner | Must resolve by |
|---|---|---|---|
| O01 | Product name confirmed as Sema; complete trademark/domain clearance | Founder | Before public branding/G5 |
| O02 | Broad non-regulated service-business pilot and sensitive-sector exclusion are confirmed; select representative eligible businesses and document screening criteria using A01 evidence | Product | G0 |
| O03 | Offer, credit preservation, cancellation/corrections and base-price-plus-tax/fee display are confirmed; verify tax/fee permission/calculation/invoicing, refund execution and the delegated calendar/limit implementation | Founder + Finance/Legal | Before live paid checkout; disclose conversion terms at G3 |
| O04 | Convex/Netlify primary architecture confirmed; Better Auth/Workflow component details delegated. Verify Free plan/order eligibility, terms, auth, integration, privacy, quota and recovery gates in §9 before live data. | Founder / Engineering + Privacy | G1 |
| O05 | Conversation retention preference is confirmed; verify lawful bases, notices/DPA, registration/DPIA/transfers, vendor deletion/backup feasibility, supporting/financial retention, rights and breach deadlines | Privacy + Kenyan counsel | Before real visitor data/G1 |
| O06 | English and Swahili are confirmed launch requirements; assign bilingual reviewers and approve localized interface copy and quality evidence | AI Lead + Product | G2; both required for customer launch |
| O07 | Prove selected host/Convex regions, transactional mutations, operator MFA/access path and complete recovery capability | Engineering | G1; recovery proof by G4 |
| O08 | Founder-only, appointment/best-effort Sema support confirmed. Publish contact/scheduling, realistic admission capacity and incident process; no fictional fixed-hour team or backup. | Founder | G3 |
| O09 | Free-tier operating preference confirmed; no positive recurring vendor budget approved. Prove actual limits, no unintended billing and full-allowance economics; hard quota exhaustion pauses service/admissions. | Founder / Engineering | G3/G4 |
| O10 | WhatsApp fee/policy/account readiness and funding model; no bundled unpriced promise | Product + Finance + Privacy | G6 |
| O11 | Hours plus available signed-in staff, away/contact capture and email alerts are confirmed; configure each customer's hours, contact and optional response expectation; no platform instant-human SLA | Customer Success | Each workspace live enablement |
| O12 | Free pilot and optional included assistance are confirmed; implement self-service readiness checklist and on-request assistance appointments, without mandatory founder approval | Founder | G3 |
| O13 | Public immediate self-service is confirmed; free offer is initial-pilot-only, with later customers paying before go-live. Implement automated readiness, eligibility, offer versioning, honest quotas and payment gates; preserve enrolled pilot terms. Broad launch requires two distinct verified pilot-business Starter payments plus release evidence. | Founder / Product + Engineering | Offer/readiness controls at G3; payment prerequisites at G4; conversion evidence at G5 |

All 30 requirements questions are answered. Confirmed choices are recorded in §15.3 and the applicable requirements above; routine engineering defaults are delegated. Convex replaces the earlier Neon/PartyServer architecture, and immediate self-service replaces the founder activation queue. The free offer is initial-pilot-only; broad paid rollout requires two distinct verified pilot-business Starter payments plus the release checks. Remaining entries concern evidence, implementation or explicitly deferred expansion, not unanswered launch-product preferences. Measured quality, vendor/account eligibility and legal/privacy readiness remain unproven until their checks pass. Track subsequent changes with date, owner, rationale and impact on tests, policy and pricing.

### 15.3 Requirements refinement log

| Topic | Current status | Remaining input / evidence |
|---|---|---|
| Product name | **Confirmed: Sema** | Trademark/domain clearance remains a launch task. |
| First customer segment | **Confirmed: broad mix of non-regulated service businesses; sensitive/regulated sectors deferred** | Select representative eligible businesses and compare segment results; no single vertical selected yet. |
| Launch channels | **Confirmed: website chat first, WhatsApp later** | Validate website usage and deliver the website scope; WhatsApp has a later readiness gate. |
| AI authority | **Confirmed: approved FAQs and human handoff only** | Build/evaluate the knowledge workflow. Live lookups, bookings and AI-initiated payments are excluded from launch. |
| Human support | **Confirmed: live inbox replies; show available only during business hours with an available signed-in agent; otherwise away/contact capture plus durable request/email alert** | Configure hours and follow-up expectations; prove presence/reconnect safety. Two seats are confirmed. |
| Languages | **Confirmed: English and Swahili in the first release** | Both interface and answer-quality requirements must pass; no English-only launch fallback. |
| Onboarding | **Confirmed: immediate self-service imports/preview/publication/activation; standard assistance available afterward on request, included in Starter** | Automated readiness/security and self-service UX are required. Assistance retains supplied-content/configuration/one-site guidance/training scope; excludes development/extensive writing/ongoing maintenance. |
| Ongoing knowledge | **Confirmed: the business updates its information in Sema** | Owner editing, preview, approval/publication and training are required; no default managed FAQ service. |
| Initial pilot | **Confirmed: free 30 days/100 replies; quota exhaustion pauses AI but retains human chat through day 30; explicit early conversion, no pilot top-ups; at day 30 stop live service and allow 30 days read/export** | Record dates and conversion; after access window erase content. No payment assumption. |
| Ongoing free-offer boundary | **Confirmed: free 30-day/100-answer offer only during the initial public pilot; later customers pay Starter before go-live** | Version and display enrollment state; preserve enrolled periods; bounded imports/preview remain self-service. |
| Broad paid-launch evidence | **Confirmed: at least two different pilot businesses explicitly convert and make verified Starter payments, plus quality/security/privacy/billing/deletion/recovery/provider checks** | G4 prerequisites permit controlled conversions; G5 requires both real payments and passing evidence. No circular first-payment gate or signup-only validation. |
| Paid launch offer | **Confirmed: KES 2,500 base/month plus applicable disclosed tax/fees, 1,000 substantive FAQ answers and two accounts; non-substantive/failed/human replies excluded** | Prove metering/economics; verify lawful accurate tax/fee/invoice implementation. |
| Paid quota exhaustion | **Confirmed: pause AI, retain human chat and offer optional KES 500/100-answer top-ups, valid for 90 days and usable during an active subscription; no automatic charge** | Prove pack expiry/concurrency invariants and unit economics. |
| Allowance reset and spending | **Confirmed: monthly included quota resets without rollover; spend included quota first, then earliest-expiring top-ups; unexpired packs survive renewals** | Prove period boundaries, reservations and independent pack expiries. |
| Renewal collection | **Confirmed: reminders and owner-authorized monthly M-Pesa; AI pauses at expiry, three days of human-chat grace, then 30-day read/export and static widget contact** | Prove provider/entitlement boundaries; verify delegated calendar boundaries and enforce confirmed cleanup. |
| Conversation retention | **Confirmed: delete content/contact/notes/linked feedback-gap excerpts after 90 days from last activity; owner may shorten to 30 or request earlier deletion** | Verify legal/vendor/backup feasibility and implement monitored erasure. |
| Knowledge source formats | **Confirmed: manual FAQs, TXT, text PDF, DOCX, one public webpage per import** | Prove extraction/security; finalize resource caps. OCR/scans, whole-site crawl and automatic synchronization are deferred. |
| Publication | **Confirmed: owner preview and explicit publication for each new/changed source** | Prove version-specific preview, atomic publication and no draft leakage. |
| Cancellation/corrections | **Confirmed: period-end cancellation, no routine proration; refund duplicate/error charges, correct wrong reply counts; review serious complaints** | Verify mandatory rights/provider execution and publish terms. |
| Inactive cleanup and credit | **Confirmed: erase workspace content after access window; preserve minimal payment/unexpired-credit ledger and restore eligible balance to an empty active workspace for the verified same owner** | Prove identity binding, erasure and original credit expiry; verify lawful financial retention. |
| Operating capacity | **Confirmed: founder personally handles setup/Sema support; scheduled appointments and best-effort asynchronous help, no fixed daily window** | Publish contact and booking process; no 24/7 or fixed-response promise. Businesses staff their own visitor inbox. |
| Vendor budget and delegation | **Confirmed: use free tiers; recommend routine engineering defaults within stack/budget, escalating material tradeoffs** | No positive recurring budget, paid upgrade or spend authorization. Verify commercial use, hard limits, privacy and actual fit. |
| Website/branding | **Confirmed: one business/website, www/apex counted together, business logo/colors plus Powered by Sema attribution** | No multi-site agency or full white-label launch. |
| Architecture | **Confirmed: Next.js/Netlify plus primary Convex database/realtime/search/files/workflows; retain IntaSend, Workers AI and Resend** | Supersedes Neon/Drizzle/pgvector/PartyServer/Inngest; auth and all listed implementation/privacy/Free eligibility checks still required. |
| Pilot registration/activation | **Confirmed: public signup with immediate self-service imports, AI preview and activation after automated checks; assistance afterward** | No mandatory founder queue. Verify email/domain/eligibility, owner publication, quotas and truthful retry states; free clock begins at verified go-live. |
| Data-region posture | **Confirmed: no Kenya-only requirement; allow disclosed non-Kenyan processing after required reviews** | Verify actual data flows, processor terms/DPA, transfer basis and retention; no legal-review completion inferred. |
| Price display | **Confirmed: add applicable tax and processing fees to KES 2,500/KES 500 base prices with clear pre-payment disclosure** | Verify tax applicability, provider fee permission/formula and compliant invoicing. |
| Bilingual source handling | **Confirmed: sources in either English or Swahili may support grounded answers in both languages; no duplicate translations required** | Test cross-language retrieval, evidence support and numerical/policy consistency. |

Customer choices establish intended requirements, not evidence of market demand or implemented quality. Confirmed prices and allowances are binding requirements. Resource limits, internal operating targets and routine technical details are delegated engineering defaults; market/outcome assumptions remain unvalidated. Deferred future prices and features are research rather than launch promises. Future refinements must propagate into scope, acceptance criteria, security, billing, evaluation and roadmap where affected.

## 16. Review disposition and sources

### 16.1 Thorough-review disposition of the supplied draft

| Draft topic | Revision / reason |
|---|---|
| Executive promise and broad market list | Adopt Sema and the confirmed service-business, website-first, FAQ/handoff scope; require English and Swahili at launch; keep pilot segments broad and sensitive-data boundaries explicit. |
| Problem and competitor claims | Relabel demand, affordability and differentiation as hypotheses. Remove unsupported local price comparisons and inference that competitors prove demand. |
| Goals and success metrics | Define cohorts, denominators, true outcomes vs reply rate, MRR arithmetic and evidence limits. Targets remain assumptions. |
| Onboarding and authentication | Immediate self-service is required; standard assistance remains included afterward and owners maintain FAQs. Use assessed Better Auth/Convex integration with verified email and roles; defer phone/Google. |
| Knowledge and “confidence” | Add public-safe approval, versioning, extraction limits, stale/conflict behavior, calibrated answerability, eval datasets and thresholds. |
| Widget and AI | Add session security, citations, bounded turns, language gates, privacy UX and retry/abuse rules; defer visitor attachments and tool actions. |
| Human inbox | Bring minimum seats/claim/reply capability into MVP; define state transitions and AI/human race prevention. |
| WhatsApp | Separate expansion gate. Specific October 2026 fee statement remains unverified from primary Meta content; do not hardcode it. |
| M-Pesa | Use the user's IntaSend preference; separate SaaS collections from merchant commerce; define manual STK renewals and verification/reconciliation. |
| Monetization | Replace ambiguous reply-or-resolution overage with one meter, caps and explicit prepaid packs. Draft future tiers/add-ons are research, not sold commitments. |
| Analytics and knowledge gaps | Keep operational counts and owner-reviewed gap list; remove unsupported revenue-attribution claims. |
| Technical architecture | Adopt user-confirmed Convex as primary backend, Next.js/Netlify, IntaSend, Workers AI and Resend. Rewrite authorization, mutation invariants, files, workflows and recovery for Convex; retain explicit Free/terms/privacy/test gates. |
| Security/privacy | Convert broad assurances into controls, legal/data gates, privacy operations, retention/deletion and incident requirements. |
| Validation, GTM and roadmap | Retain interviews, paid evidence and agency/channel experiments; stage launch by evidence instead of overlapping dates or unbuilt promises. |
| Risks and open questions | Add early signals, owners, dependencies and approval gates. Resolve baseline design ambiguities while identifying genuine remaining decisions. |

Founder-led demos and partnerships with web agencies/developers are initial distribution experiments. Measure qualified demos → activated pilots → paying workspaces → second renewal. Case studies and quantified time/revenue savings require customer permission and actual evidence. Standard assisted setup is included in the confirmed Starter price and must not be separately charged. The draft's KES 10,000–50,000 general setup fee is superseded. Its KES 5,000–15,000 WhatsApp, KES 25,000+ custom integration and agency/add-on price ranges remain unvalidated future research, outside the launch price list.

### 16.2 External verification ledger

Primary documentation checked on **15 October 2026**. Links support the limited facts below; they do not establish implementation, market fit, legal compliance or account-specific availability. Recheck before dependency integration or publishing price/policy claims.

| ID | Claim / result | Primary source | PRD consequence |
|---|---|---|---|
| V01 | Convex is a reactive non-Postgres database with TypeScript functions | [Overview](https://docs.convex.dev/understanding/overview) | Current user-confirmed backend; no SQL/Drizzle or automatic tenant isolation assumed. |
| V02 | Convex mutations are transactional; external actions require explicit side-effect/retry controls | [Mutations](https://docs.convex.dev/functions/mutation-functions), [actions](https://docs.convex.dev/functions/actions) | Preserve atomic application effects plus provider idempotency/reconciliation. |
| V03 | Better Auth integration/Next.js guide exists; native Convex Auth remains beta | [Integration](https://labs.convex.dev/better-auth/framework-guides/next), [auth status](https://docs.convex.dev/auth/convex-auth) | Assess supported production-compatible integration, verified email, reset/revocation and permissions. |
| V04 | Convex supports vector search and file storage with explicit constraints | [Vector search](https://docs.convex.dev/search/vector-search), [file serving](https://docs.convex.dev/file-storage/serve-files) | Partition/recheck retrieval; never treat bearer source URLs as private expiring links. |
| V05 | Hosted PartyKit closes 23 October 2026 | [Shutdown](https://blog.partykit.io/posts/hosted-platform-shutdown) | Historical replacement rationale; PartyKit/PartyServer are no longer current Sema dependencies. |
| V06 | Vercel runtime support does not establish Free commercial rights; Hobby is restricted to noncommercial personal use | [Limits](https://vercel.com/docs/functions/limitations), [fair use](https://vercel.com/docs/limits/fair-use-guidelines) | Original Vercel Free assumption is invalid for intended commercial Sema; alternative/funding decision needed. |
| V07 | IntaSend documents Kenya M-Pesa STK prompts requiring payer authorization | [M-Pesa STK Push](https://developers.intasend.com/guides/collections/mpesa-stk-push/) | Manual renewal collection baseline; no inferred recurring-debit mandate. |
| V08 | IntaSend webhooks document challenge checks, replay/out-of-order handling and critical-state confirmation | [IntaSend webhooks](https://developers.intasend.com/guides/webhooks/) | Verify API state and amount before entitlement; use idempotent handling. |
| V09 | Intercom's public pricing page displays Fin pricing **from US$0.99 per outcome** | [Intercom pricing](https://www.intercom.com/pricing) | Limited competitive reference only. Packaging varies; it does not validate Kenyan willingness to pay or equivalent outcomes. |
| V10 | ODPC provides controller/processor compliance descriptions, registration guidance and a breach-reporting process | [Compliance](https://www.odpc.go.ke/data-protection-compliance/), [registration guidance](https://www.odpc.go.ke/wp-content/uploads/2024/02/ODPC-Guidance-Note-on-Registration-of-Data-Controllers-and-Data-Processors.pdf), [breach reporting](https://www.odpc.go.ke/report-a-data-breach/) | Require legal/privacy implementation gate; avoid assumed small-business exemption or generic compliance claims. |
| V11 | Convex and supporting Free constraints/terms limitations are in §9.6–9.7 | Primary official links in those sections, checked 15 October 2026 | Actual plan/order eligibility, implementation, privacy/deletion and recovery still require proof; full TOS/DPA were subsequently rendered/read. |
| U01 | Draft claim: some WhatsApp service messages became chargeable on 1 October 2026 above a monthly allowance | Primary [Meta pricing](https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing) and [non-template message pricing](https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing/non-template-messages) were attempted but could not be retrieved | **Unverified in this review**, not declared false. Secondary search results are insufficient for launch rules or margin calculations. Recheck primary Meta/account/BSP terms at G6. |
| U02 | Draft local competitor prices: WebFiti ~KES 890, Botmara ~KES 2,000, Datacare ~KES 12,000–28,000 | Draft references were unresolved `[web:*]` markers; these exact local offers were not independently verified | Omit numeric comparison from positioning and forecasts until official current offers are checked. |
| U03 | Exact current legal obligations and deadlines for this operating model | [Kenya Law — Data Protection Act source](https://new.kenyalaw.org/akn/ke/act/2019/24/eng%402022-12-31/source.pdf) retrieval returned access blocked; ODPC guidance was available | No blanket legal certification or inferred deadline matrix. Kenyan counsel must check current law/regulations, transfers, registration, rights, breaches and retention before real data. |

### 16.3 Definition of done for this PRD baseline

This revision provides a scoped product contract, functional acceptance criteria, nonfunctional targets, a measurable RAG quality framework, deterministic billing rules, the preferred architecture, privacy/security requirements, operational ownership, release gates, risks and a sequenced roadmap. The 30-question product refinement is complete; this document records the confirmed launch choices and delegated engineering defaults. Implementation requires named owners and the scoped backlog; customer launch requires the applicable evidence gates, and broad paid rollout also requires two distinct verified pilot-business Starter payments. No implementation, customer validation, legal compliance, vendor eligibility or operational readiness is implied by completion of the document.
