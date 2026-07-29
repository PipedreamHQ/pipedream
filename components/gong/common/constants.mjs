const SUMMARY_LABEL = "$summary";
const BASE_URL = "https://us-66463.api.gong.io";
const VERSION_PATH = "/v2";
const LAST_CREATED_AT = "lastCreatedAt";
const DEFAULT_MAX = 600;

// Gong's public API reference. Anchors are `#<method>-<path>`, e.g.
// `#post-/v2/calls/extensive`. This host serves the docs for every tenant.
const DOCS_URL = "https://gong.app.gong.io/settings/api/documentation";

const MIN_LIMIT = 1;
const MAX_LIMIT = 1000;
const DEFAULT_LIMIT = 100;

const DIRECTIONS = [
  "Inbound",
  "Outbound",
  "Conference",
  "Unknown",
];

const CALL_PROVIDER_CODES = [
  "zoom",
  "clearslide",
  "gotomeeting",
  "ringcentral",
  "outreach",
  "insidesales",
];

// `contentSelector.exposedFields.content.*` flags on POST /v2/calls/extensive.
const CONTENT_FIELDS = [
  {
    label: "Brief - Spotlight call brief (the call summary)",
    value: "brief",
  },
  {
    label: "Key Points - the call's key points",
    value: "keyPoints",
  },
  {
    label: "Outline - the call outline, including next steps",
    value: "outline",
  },
  {
    label: "Highlights - the call highlights",
    value: "highlights",
  },
  {
    label: "Call Outcome - the outcome of the call",
    value: "callOutcome",
  },
  {
    label: "Topics - duration of each call topic",
    value: "topics",
  },
  {
    label: "Trackers - smart and keyword tracker hits",
    value: "trackers",
  },
  {
    label: "Tracker Occurrences - timing and speaker of each tracker hit (requires Trackers)",
    value: "trackerOccurrences",
  },
  {
    label: "Structure - the call agenda",
    value: "structure",
  },
];

// `contentSelector.exposedFields.interaction.*` on POST /v2/calls/extensive.
const INTERACTION_FIELDS = [
  {
    label: "Speakers - per-speaker talk time",
    value: "speakers",
  },
  {
    label: "Person Interaction Stats - talk ratio, longest monologue, patience, etc.",
    value: "personInteractionStats",
  },
  {
    label: "Questions - question counts by company and non-company speakers",
    value: "questions",
  },
  {
    label: "Video - video interaction stats",
    value: "video",
  },
];

// `contentSelector.context` on POST /v2/calls/extensive.
const CONTEXT_OPTIONS = [
  {
    label: "None - no CRM or external-system data",
    value: "None",
  },
  {
    label: "Basic - links to external system objects (CRM, telephony, case management)",
    value: "Basic",
  },
  {
    label: "Extended - links plus the object fields themselves (account, deal, opportunity values)",
    value: "Extended",
  },
];

// `contentSelector.contextTiming` on POST /v2/calls/extensive.
const CONTEXT_TIMING_OPTIONS = [
  "Now",
  "TimeOfCall",
];

const TRACKER_OCCURRENCES_FIELD = "trackerOccurrences";
const TRACKERS_FIELD = "trackers";
const EXTENDED_CONTEXT = "Extended";

export default {
  SUMMARY_LABEL,
  BASE_URL,
  VERSION_PATH,
  DOCS_URL,
  DEFAULT_MAX,
  MIN_LIMIT,
  MAX_LIMIT,
  DEFAULT_LIMIT,
  LAST_CREATED_AT,
  DIRECTIONS,
  CALL_PROVIDER_CODES,
  CONTENT_FIELDS,
  INTERACTION_FIELDS,
  CONTEXT_OPTIONS,
  CONTEXT_TIMING_OPTIONS,
  TRACKERS_FIELD,
  TRACKER_OCCURRENCES_FIELD,
  EXTENDED_CONTEXT,
};
