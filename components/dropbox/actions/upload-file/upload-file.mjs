import { getFileStream } from "@pipedream/platform";
import consts from "../../common/consts.mjs";
import dropbox from "../../dropbox.app.mjs";

export default {
  name: "Upload a File",
  description: "Uploads a file to a selected folder. [See the documentation](https://dropbox.github.io/dropbox-sdk-js/Dropbox.html#filesUpload__anchor)",
  key: "dropbox-upload-file",
  version: "1.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
      label: "File Name",
      description: "The name of your new file (make sure to include the file extension).",
    },
    filePath: {
      type: "string",
      label: "File Path or URL",
      description: "Provide either a file URL or a path to a file in the /tmp directory (for example, /tmp/myFile.pdf).",
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
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      filePath,
      path,
      name,
      autorename,
      mute,
      strictConflict,
      mode,
      clientModified,
    } = this;

    const contents = await getFileStream(filePath);

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
