import dropbox from "../../dropbox.app.mjs";
import consts from "../../common/consts.mjs";
import fs from "fs";
import got from "got";
import { ConfigurationError } from "@pipedream/platform";

export default {
  name: "Upload Multiple Files",
  description: "Uploads multiple file to a selected folder. [See the documentation](https://dropbox.github.io/dropbox-sdk-js/Dropbox.html#filesUpload__anchor)",
  key: "dropbox-upload-multiple-files",
  version: "0.0.1",
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
    fileUrls: {
      type: "string[]",
      label: "File URLs",
      description: "The URLs of the files you want to upload to Dropbox. Must specify either File URLs or File Paths.",
      default: [],
      optional: true,
    },
    filePaths: {
      type: "string[]",
      label: "File Paths",
      description: "The paths to the files, e.g. /tmp/myFile.csv . Must specify either File URLs or File Paths.",
      default: [],
      optional: true,
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
  },
  async run({ $ }) {
    const {
      dropbox,
      path,
      fileUrls,
      filePaths,
      autorename,
      mute,
      strictConflict,
      mode,
      filenames,
    } = this;

    if (!fileUrls?.length && !filePaths?.length) {
      throw new ConfigurationError("Must specify either File URLs or File Paths.");
    }

    const numFiles = fileUrls.length + filePaths.length;
    if (numFiles !== filenames.length) {
      throw new ConfigurationError(`Number of filenames must match number of files. Detected ${numFiles} file(s) and ${filenames.length} filename(s)`);
    }

    const fileInfo = [];
    const normalizedPath = dropbox.getNormalizedPath(path, true);
    let i = 0;

    if (fileUrls?.length) {
      for (const url of fileUrls) {
        fileInfo.push({
          contents: await got.stream(url),
          path: `${normalizedPath}${filenames[i]}`,
        });
        i++;
      }
    }

    if (filePaths?.length) {
      for (const filePath of filePaths) {
        fileInfo.push({
          contents: fs.createReadStream(filePath),
          path: `${normalizedPath}${filenames[i]}`,
        });
        i++;
      }
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
