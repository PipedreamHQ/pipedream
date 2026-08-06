const BASE_URL = "https://api.speakai.co";
const VERSION_PATH = "/v1";

const DEFAULT_LIMIT = 50;

// `GET /prompt` has no promptId filter, so New AI Chat Response finds its record
// by scanning the newest page of history. The API defaults to 25, which is thin
// once several chats finish close together or a delivery is retried late.
const PROMPT_HISTORY_PAGE_SIZE = 100;

const WEBHOOK_ID = "webhookId";

const WEBHOOK_DESCRIPTION = "Created by Pipedream";

// Attributes the subscription to Pipedream in Speak AI. The API defaults this to
// `speak` when omitted, which makes Pipedream sources indistinguishable from
// webhooks a user created by hand.
const WEBHOOK_SOURCE = "pipedream";

const ASSISTANT_TYPES = [
  "general",
  "researcher",
  "marketer",
  "sales",
  "recruiter",
];

const CAPTION_FILE_TYPES = [
  "srt",
  "vtt",
];

export default {
  BASE_URL,
  VERSION_PATH,
  DEFAULT_LIMIT,
  PROMPT_HISTORY_PAGE_SIZE,
  WEBHOOK_ID,
  WEBHOOK_DESCRIPTION,
  WEBHOOK_SOURCE,
  ASSISTANT_TYPES,
  CAPTION_FILE_TYPES,
};
