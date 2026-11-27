const BASE_URL = "https://api.supabird.io/v1";

const NETWORKS = [
  {
    label: "X",
    value: "x",
  },
  {
    label: "LinkedIn",
    value: "linkedin",
  },
  {
    label: "Threads",
    value: "threads",
  },
  {
    label: "Bluesky",
    value: "bluesky",
  },
  {
    label: "Instagram",
    value: "instagram",
  },
  {
    label: "TikTok",
    value: "tiktok",
  },
  {
    label: "All connected networks",
    value: "all",
  },
];

const WEEKDAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
  "today",
  "tomorrow",
];

const WHEN = {
  NEXT_SLOT: "next_slot",
  SCHEDULED_AT: "scheduled_at",
  NOW: "now",
};

const WHEN_OPTIONS = [
  {
    label: "Next free slot",
    value: WHEN.NEXT_SLOT,
  },
  {
    label: "At a specific time",
    value: WHEN.SCHEDULED_AT,
  },
  {
    label: "Now",
    value: WHEN.NOW,
  },
];

const WRITING_STYLES = [
  {
    label: "My style",
    value: "myStyle",
  },
  {
    label: "Style of chosen creators",
    value: "creators",
  },
];

const IDEA_SOURCES = [
  {
    label: "My own posts",
    value: "user",
  },
  {
    label: "Chosen creators' posts",
    value: "creator",
  },
];

const PAGE_LIMIT = 25;
const OPTIONS_PAGE_LIMIT = 25;
const MAX_PAGES_PER_POLL = 5;
const STOP_AFTER_SEEN = 10;
const MAX_SEEN_IDS = 500;
const MAX_EMIT_ON_FIRST_RUN = 25;

const JOB_POLL_INTERVAL_MS = 3000;
const POST_JOB_TIMEOUT_MS = 60000;
const IDEAS_JOB_TIMEOUT_MS = 120000;
const MAX_RETRY_AFTER_SECONDS = 30;

export default {
  BASE_URL,
  NETWORKS,
  WEEKDAYS,
  WHEN,
  WHEN_OPTIONS,
  WRITING_STYLES,
  IDEA_SOURCES,
  PAGE_LIMIT,
  OPTIONS_PAGE_LIMIT,
  MAX_PAGES_PER_POLL,
  STOP_AFTER_SEEN,
  MAX_SEEN_IDS,
  MAX_EMIT_ON_FIRST_RUN,
  JOB_POLL_INTERVAL_MS,
  POST_JOB_TIMEOUT_MS,
  IDEAS_JOB_TIMEOUT_MS,
  MAX_RETRY_AFTER_SECONDS,
};
