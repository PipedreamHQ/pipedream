const BASE_URL = "https://api2.frontapp.com";

const METHOD = {
  POST: "post",
  PUT: "put",
  DELETE: "delete",
  PATCH: "patch",
  IMPORT_INBOX_MESSAGE: "import-inbox-message",
  LIST_CONVERSATIONS: "list-conversations",
};

const TYPES_OPTIONS = [
  "assign",
  "unassign",
  "archive",
  "reopen",
  "trash",
  "restore",
  "comment",
  "mention",
  "inbound",
  "outbound",
  "move",
  "forward",
  "tag",
  "untag",
  "link_added",
  "link_removed",
  "sending_error",
  "message_bounce_error",
  "reminder",
  "out_reply",
  "conversations_merged",
];

export default {
  BASE_URL,
  METHOD,
  TYPES_OPTIONS,
};
