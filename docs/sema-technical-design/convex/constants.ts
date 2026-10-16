// Schema-time baseline. Provider response length must be checked before every vector write.
// BAAI's BGE-M3 model card specifies 1024 dense dimensions; the Workers AI adapter remains a spike.
export const EMBEDDING_DIMENSIONS = 1024;
export const EMBEDDING_SCHEMA_VERSION = "bge-m3-dense-1024-v1";
export const LIMITS = {
  maxFileBytes: 2_000_000,
  maxPageCount: 50,
  maxExtractedCharacters: 200_000,
  maxSourcesPilot: 5,
  maxSourcesStarter: 20,
  maxRawBytesPilot: 10_000_000,
  maxRawBytesStarter: 25_000_000,
  maxChunksPilot: 500,
  maxChunksStarter: 1000,
  maxVisitorCharacters: 2000,
  maxVisitorTurns: 30,
  maxManifestSources: 20,
  maxEvidencePerAnswer: 5,
  maxInputTokens: 8000,
  maxOutputTokens: 600,
  previewCallsPerDay: 50,
  aiPerWorkspace: 3,
  pilotGlobalAiBaseline: 5,
  queueWaitMs: 10_000,
  generationTimeoutMs: 15_000,
  totalAnswerTimeoutMs: 20_000,
  reservationLeaseMs: 60_000,
  sessionMs: 24 * 60 * 60 * 1000,
  presenceHeartbeatMs: 30_000,
  presenceLeaseMs: 60_000,
  pilotMs: 30 * 24 * 60 * 60 * 1000,
  paidGraceMs: 3 * 24 * 60 * 60 * 1000,
  readExportMs: 30 * 24 * 60 * 60 * 1000,
  topupMs: 90 * 24 * 60 * 60 * 1000,
} as const;
export const LAUNCH_OFFERS = {
  pilot: { baseMinor: 0, units: 100, seats: 2 },
  starter: { baseMinor: 250_000, units: 1000, seats: 2 },
  topup: { baseMinor: 50_000, units: 100 },
} as const;
// Taxes/processing fees are deliberately absent: verified versioned quote rules must supply them.
