import {
  getFileStream, ConfigurationError,
} from "@pipedream/platform";
import consts from "../../common/consts.mjs";
import dropbox from "../../dropbox.app.mjs";

export default {
  name: "Upload Multiple Files",
  description: "Uploads multiple file to a selected folder. [See the documentation](https://dropbox.github.io/dropbox-sdk-js/Dropbox.html#filesUpload__anchor)",
  key: "dropbox-upload-multiple-files",
  version: "1.0.2",
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
      description: "The folder to upload to. Type the folder name to search for it in the user's Dropbox.",
    },
    filesPaths: {
      type: "string[]",
      label: "File Paths or URLs",
      description: "Provide an array of either file URLs or paths to a files in the /tmp directory (for example, /tmp/myFile.pdf).",
    },
    filenames: {
      type: "string[]",
      label: "File Names",
      description: "An array of filenames for the new files. Please provide a name for each URL and/or Path. Make sure to include the file extensions.",
    },
    autorename: {
      type: "boolean",
      label: "Autorename",
      description: "If there's a conflict, have Dropbox try to autorename the file to avoid the conflict.",
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
      dropbox,
      path,
      filesPaths,
      autorename,
      mute,
      strictConflict,
      mode,
      filenames,
    } = this;

    const numFiles = filesPaths.length;
    if (numFiles !== filenames.length) {
      throw new ConfigurationError(`Number of filenames must match number of files. Detected ${numFiles} file(s) and ${filenames.length} filename(s)`);
    }

    const fileInfo = [];
    const normalizedPath = dropbox.getNormalizedPath(path, true);
    let i = 0;

    for (const file of filesPaths) {
      const contents = await getFileStream(file);
      fileInfo.push({
        contents,
        path: `${normalizedPath}${filenames[i]}`,
      });
      i++;
    }

    const responses = [];
    for (const file of fileInfo) {
      const { result } = await dropbox.uploadFile({
        contents: file.contents,
        autorename,
        path: file.path,
        mode: mode
          ? {
            ".tag": mode,
          }
          : undefined,
        mute,
        strict_conflict: strictConflict,
      });
      responses.push(result);
    }
    $.export("$summary", "Files successfully uploaded");
    return responses;
  },
};
