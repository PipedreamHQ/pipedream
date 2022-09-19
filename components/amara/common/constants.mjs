const BASE_URL = "https://amara.org";
const VERSION_PATH = "/api";
const X_API_KEY_HEADER = "X-api-key";
const CONTENT_TYPE_HEADER = "Content-Type";
const JSON_CONTENT_TYPE = "application/json";
const LAST_URL = "lastUrl";
const LAST_RESOURCE_STR = "lastResourceStr";
const DEFAULT_MAX_ITEMS = 300;
const DEFAULT_PAGE_LIMIT = 100;

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

const ACTIVITY_TYPES = {
  VIDEO_ADDED: "video-added",
  COMMENT_ADDED: "comment-added",
  VERSION_ADDED: "version-added",
  VIDEO_TITLE_CHANGED: "video-title-changed",
  VIDEO_URL_ADDED: "video-url-added",
  VIDEO_URL_EDITED: "video-url-edited",
  VIDEO_URL_DELETED: "video-url-deleted",
  VIDEO_DELETED: "video-deleted",
  MEMBER_JOINED: "member-joined",
  MEMBER_LEFT: "member-left",
  VIDEO_MOVED_FROM_TEAM: "video-moved-from-team",
  VIDEO_MOVED_TO_TEAM: "video-moved-to-team",
  VERSION_APPROVED: "version-approved",
  VERSION_REJECTED: "version-rejected",
  VERSION_ACCEPTED: "version-accepted",
  VERSION_DECLINED: "version-declined",
  COLLAB_JOIN: "collab-join",
  COLLAB_LEAVE: "collab-leave",
  COLLAB_ASSIGN: "collab-assign",
  COLLAB_REASSIGN: "collab-reassign",
  COLLAB_UNASSIGN: "collab-unassign",
  COLLAB_AUTO_UNASSIGNED: "collab-auto-unassigned",
  COLLAB_DEADLINE_PASSED: "collab-deadline-passed",
  COLLAB_DELETE: "collab-delete",
  COLLAB_STATE_CHANGE: "collab-state-change",
  COLLAB_TEAM_CHANGE: "collab-team-change",
};

const FORMAT_TYPES = {
  SRT: "srt",
  DFXP:	"dfxp",
  SBV: "sbv",
  SSA: "ssa",
  WEBVTT: "vtt",
  JSON: "json",
};

export default {
  BASE_URL,
  VERSION_PATH,
  X_API_KEY_HEADER,
  CONTENT_TYPE_HEADER,
  JSON_CONTENT_TYPE,
  LAST_URL,
  LAST_RESOURCE_STR,
  EVENT_TYPES,
  ORDER_BY,
  FORMAT_TYPES,
  DEFAULT_MAX_ITEMS,
  DEFAULT_PAGE_LIMIT,
  ACTIVITY_TYPES,
};
