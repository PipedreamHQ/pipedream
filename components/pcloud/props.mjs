import pcloud from "./pcloud.app.mjs";

const fileId = {
  propDefinition: [
    pcloud,
    "fileId",
  ],
};
const folderId = {
  propDefinition: [
    pcloud,
    "folderId",
  ],
};
const toFolderId = {
  propDefinition: [
    pcloud,
    "toFolderId",
  ],
};

const name = {
  type: "string",
  label: "Name",
  description: "Name of the folder to be created.",
};

const overwrite = {
  type: "boolean",
  label: "Overwrite?",
  description: `If true, and an entry with the same name already exists, it will be overwritten.
        \\
        Otherwise, an error \`2004\` will be returned instead.`,
  default: false,
  optional: true,
};

const showDeleted = {
  type: "boolean",
  label: "Show Deleted?",
  description: "If true, deleted files and folders that can be undeleted will be displayed.",
  default: false,
  optional: true,
};

const modifiedTime = {
  type: "integer",
  label: "Modified Time",
  description: "Must be Unix time (seconds).",
  optional: true,
};
const createdTime = {
  type: "integer",
  label: "Created Time",
  description: `Must be Unix time (seconds).
  \\
  Requires \`Modified Time\` to be set.`,
  optional: true,
};

export default {
  fileId,
  folderId,
  toFolderId,
  name,
  overwrite,
  showDeleted,
  modifiedTime,
  createdTime,
};
