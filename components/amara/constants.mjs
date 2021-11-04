const BASE_URL = "https://amara.org";
const VERSION_PATH = "/api";
const X_API_KEY_HEADER = "X-api-key";
const CONTENT_TYPE_HEADER = "Content-Type";
const JSON_CONTENT_TYPE = "application/json";
const LAST_URL = "lastUrl";

/**
 * The list of order by options can be found in the following links
 * https://apidocs.amara.org/#list-videos
 * https://apidocs.amara.org/#list-tasks-for-a-team
 */
const ORDER_BY = {
  TITLE_ASC: "title",
  TITLE_DESC: "-title",
  CREATED_ASC: "created",
  CREATED_DESC: "-created",
  MODIFIED_ASC: "modified",
  MODIFIED_DESC: "-modified",
  PRIORITY_ASC: "priority",
  PRIORITY_DESC: "-priority",
  TYPE_ASC: "type",
  TYPE_DESC: "-type",
};

/**
 * The list of video event types are [here](https://apidocs.amara.org/#video-notifications)
 */
const EVENT_TYPES = {
  VIDEO_ADDED: "video-added",
  VIDEO_REMOVED: "video-removed",
  VIDEO_MADE_PRIMARY: "video-made-primary",
  VIDEO_MOVED_PROJECT: "video-moved-project",
  SUBTITLES_PUBLISHED: "subtitles-published",
  SUBTITLES_UNPUBLISHED: "subtitle-unpublished",
};

export default {
  BASE_URL,
  VERSION_PATH,
  X_API_KEY_HEADER,
  CONTENT_TYPE_HEADER,
  JSON_CONTENT_TYPE,
  LAST_URL,
  EVENT_TYPES,
  ORDER_BY,
};
