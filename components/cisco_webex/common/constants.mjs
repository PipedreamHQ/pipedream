const BASE_URL = "https://webexapis.com";
const VERSION_PATH = "/v1";
const WEBHOOK_ID = "webhookId";
const WEBHOOK_SECRET = "webhookSecret";
const SIGNATURE_HEADER = "x-spark-signature";

const REGEXP = {
  URL: new RegExp("(?<=<).+(?=>)"),
  REL: new RegExp("(?<=rel=\").+(?=\")"),
};

const RESOURCE_TYPE = {
  ATTACHMENT_ACTIONS: "attachmentActions",
  MEMBERSHIPS: "memberships",
  MESSAGES: "messages",
  ROOMS: "rooms",
  MEETINGS: "meetings",
  RECORDINGS: "recordings",
  MEETING_PARTICIPANTS: "meetingParticipants",
  MEETING_TRANSCRIPTS: "meetingTranscripts",
};

const EVENT_TYPE = {
  CREATED: "created",
  UPDATED: "updated",
  DELETED: "deleted",
  STARTED: "started",
  ENDED: "ended",
  JOINED: "joined",
  LEFT: "left",
};

export default {
  BASE_URL,
  VERSION_PATH,
  REGEXP,
  SIGNATURE_HEADER,
  WEBHOOK_ID,
  WEBHOOK_SECRET,
  RESOURCE_TYPE,
  EVENT_TYPE,
};
