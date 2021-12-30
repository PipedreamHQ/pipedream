import dropbox from "../../dropbox.app.mjs";
import isNil from "lodash/isNil.js";
import get from "lodash/get.js";
import isEmpty from "lodash/isEmpty.js";
import consts from "../../consts.mjs";

export default {
  name: "Upload a File",
  description: "Uploads a file to a selected folder. [See docs here](https://dropbox.github.io/dropbox-sdk-js/Dropbox.html#filesUpload__anchor)",
  key: "dropbox-upload-a-file",
  version: "0.0.1",
  type: "action",
  props: {
    dropbox,
    path: {
      propDefinition: [
        dropbox,
        "pathFolder",
      ],
      description: "The Path in the user's Dropbox to create the folder. If not filled, it will be created on the root folder.(Please use a valid path to filter the values)",
    },
    name: {
      type: "string",
      label: "Folder name",
      description: "Your new folder name.",
    },
    autorename: {
      type: "boolean",
      label: "Autorename",
      description: "If there's a conflict, as determined by mode, have the Dropbox server try to autorename the file to avoid conflict.",
    },
    mute: {
      type: "boolean",
      label: "Mute",
      description: "Normally, users are made aware of any file modifications in their Dropbox account via notifications in the client software. If true, this tells the clients that this modification shouldn't result in a user notification.",
    },
    strictConflict: {
      type: "boolean",
      label: "Strict Conflict",
      description: "Be more strict about how each WriteMode detects conflict. For example, always return a conflict error when mode = WriteMode.update and the given \"rev\" doesn't match the existing file's \"rev\", even if the existing file has been deleted. This also forces a conflict even when the target path refers to a file with identical contents.",
    },
    mode: {
      type: "string",
      label: "Mode",
      description: "Selects what to do if the file already exists.",
      options: consts.UPLOAD_FILE_MODE_OPTIONS,
    },
    clientModified: {
      type: "string",
      label: "Client Modified",
      description: "The value to store as the client_modified timestamp. Dropbox automatically records the time at which the file was written to the Dropbox servers. It can also record an additional timestamp, provided by Dropbox desktop clients, mobile clients, and API apps of when the file was actually created or modified. (Please provide a valid [timestamp](https://dropbox.github.io/dropbox-sdk-js/global.html#Timestamp) value)",
    },
  },
  async run({ $ }) {
    const {
      autorename,
      name,
      path,
    } = this;

    let normalizedPath = get(path, "value", path);

    // Check for empties path
    if (isNil(normalizedPath) || isEmpty(normalizedPath)) {
      normalizedPath = "/";
    }

    // Check if last char is not /
    if (normalizedPath[normalizedPath.length - 1] !== "/") {
      normalizedPath += "/";
    }

    const res = await this.dropbox.createFolder({
      autorename,
      path: normalizedPath + name,
    });
    $.export("$summary", "Folder successfully created");
    return res;
  },
};
