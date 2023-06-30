const BASE_URL = "https://api.livestorm.co";
const VERSION_PATH = "/v1";
const LAST_CREATED_AT = "lastCreatedAt";
const DEFAULT_MAX = 600;

const EVENT_STATUS = {
  DRAFT: "draft",
  PUBLISHED: "published",
};

const ROLE = {
  PARTICIPANT: {
    label: "Participant",
    value: "participant",
  },
  TEAM_MEMBER: {
    label: "Team Member",
    value: "team_member",
  },
};

const WEBHOOK_ID = "webhookId";

export default {
  BASE_URL,
  VERSION_PATH,
  DEFAULT_MAX,
  LAST_CREATED_AT,
  EVENT_STATUS,
  ROLE,
  WEBHOOK_ID,
};
