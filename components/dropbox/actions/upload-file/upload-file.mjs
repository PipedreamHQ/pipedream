import dropbox from "../../dropbox.app.mjs";
import consts from "../../common/consts.mjs";
import fs from "fs";
import got from "got";

export default {
  name: "Upload a File",
  description: "Uploads a file to a selected folder. [See docs here](https://dropbox.github.io/dropbox-sdk-js/Dropbox.html#filesUpload__anchor)",
  key: "dropbox-upload-file",
  version: "0.0.12",
  type: "action",
  props: {
    dropbox,
    path: {
      propDefinition: [
        dropbox,
        "path",
        () => ({
          filter: ({ metadata: { metadata: { [".tag"]: type } } }) => type === "folder",
        }),
      ],
      description: "Type the folder name to search for it in the user's Dropbox. If not filled, it will be created in the root folder.",
    },
    name: {
      type: "string",
      label: "File name",
      description: "The name of your new file.",
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
      description: "If there's a conflict, have Dropbox try to autorename the folder to avoid the conflict.",
      optional: true,
    },
    mute: {
      type: "boolean",
      label: "Mute",
      description: "Normally, users are made aware of any file modifications in their Dropbox account via notifications in the client software. If `true`, this will not result in a user notification.",
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

    let normalizedPath = this.dropbox.getNormalizedPath(path, true);

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
    $.export("$summary", `File successfully uploaded to "${path?.label || path}"`);
    return res;
  },
};
