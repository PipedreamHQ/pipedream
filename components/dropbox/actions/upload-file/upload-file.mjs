import dropbox from "../../dropbox.app.mjs";
import consts from "../../consts.mjs";
import fs from "fs";
import got from "got";
import common from "../../common.mjs";

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
      description: "The Path in the user's Dropbox to create the file. If not filled, it will be created on the root folder.(Please use a valid path to filter the values)",
    },
    name: {
      type: "string",
      label: "Folder name",
      description: "Your new folder name.",
    },
    fileUrl: {
      type: "string",
      label: "File URL",
      description: "The URL of the file you want to upload to Dropbox. Must specify either File URL or File Path.",
      optional: true,
    },
    filePath: {
      type: "string",
      label: "File Path",
      description: "The path to the file, e.g. /tmp/myFile.csv . Must specify either File URL or File Path.",
      optional: true,
    },
    autorename: {
      type: "boolean",
      label: "Autorename",
      description: "If there's a conflict, as determined by mode, have the Dropbox server try to autorename the file to avoid conflict.",
      optional: true,
    },
    mute: {
      type: "boolean",
      label: "Mute",
      description: "Normally, users are made aware of any file modifications in their Dropbox account via notifications in the client software. If true, this tells the clients that this modification shouldn't result in a user notification.",
      optional: true,
    },
    strictConflict: {
      type: "boolean",
      label: "Strict Conflict",
      description: "Be more strict about how each WriteMode detects conflict. For example, always return a conflict error when mode = WriteMode.update and the given \"rev\" doesn't match the existing file's \"rev\", even if the existing file has been deleted. This also forces a conflict even when the target path refers to a file with identical contents.",
      optional: true,
    },
    mode: {
      type: "string",
      label: "Mode",
      description: "Selects what to do if the file already exists.",
      options: consts.UPLOAD_FILE_MODE_OPTIONS,
      optional: true,
    },
    clientModified: {
      type: "string",
      label: "Client Modified",
      description: "The value to store as the client_modified timestamp. Dropbox automatically records the time at which the file was written to the Dropbox servers. It can also record an additional timestamp, provided by Dropbox desktop clients, mobile clients, and API apps of when the file was actually created or modified. (Please provide a valid [timestamp](https://dropbox.github.io/dropbox-sdk-js/global.html#Timestamp) value)",
      optional: true,
    },
  },
  methods: {
    ...common.methods,
  },
  async run({ $ }) {
    const {
      fileUrl,
      filePath,
      path,
      name,
      autorename,
      mute,
      strictConflict,
      mode,
      clientModified,
    } = this;

    const contents = fileUrl
      ? await got.stream(fileUrl)
      : fs.createReadStream(filePath);

    let normalizedPath = this.getNormalizedPath(path, true);

    const res = await this.dropbox.uploadFile({
      contents,
      autorename,
      path: normalizedPath + name,
      mode: mode
        ? {
          ".tag": mode,
        }
        : undefined,
      client_modified: clientModified,
      mute,
      strict_conflict: strictConflict,
    });
    $.export("$summary", "File successfully uploaded");
    return res;
  },
};
