export default {
  SEARCH_FILE_FOLDER_ORDER_BY_OPTIONS: [
    "relevance",
    "last_modified_time",
  ],
  SEARCH_FILE_FOLDER_STATUS_OPTIONS: [
    "active",
    "deleted",
  ],
  FILES_CATEGORIES_OPTIONS: [
    "image",
    "document",
    "pdf",
    "spreadsheet",
    "presentation",
    "audio",
    "video",
    "folder",
    "paper",
    "others",
    "other",
  ],
  LIST_FILE_REVISIONS_OPTIONS: [
    "path",
    "id",
  ],
  CREATE_SHARED_LINK_AUDIENCE_OPTIONS: [
    "public",
    "team",
    "no_one",
  ],
  CREATE_SHARED_LINK_ACCESS_OPTIONS: [
    {
      value: "viewer",
      label: "Users who use the link can view and comment on the content",
    },
    {
      value: "editor",
      label: "Users who use the link can edit, view and comment on the content. Note, not all file types support edit links yet.",
    },
    {
      value: "max",
      label: "Request for the maximum access level you can set the link to",
    },
    {
      value: "default",
      label: "Request for the default access level the user has set",
    },
  ],
  CREATE_SHARED_LINK_REQUESTED_VISIBILITY_OPTIONS: [
    "public",
    "team_only",
    "password",
  ],
  UPLOAD_FILE_MODE_OPTIONS: [
    "add",
    "overwrite",
    "update",
  ],
};
