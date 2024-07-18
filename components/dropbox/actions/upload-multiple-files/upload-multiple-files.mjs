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
      optional: true,
      reloadProps: true,
    },
    filePaths: {
      type: "string[]",
      label: "File Paths",
      description: "The paths to the files, e.g. /tmp/myFile.csv . Must specify either File URLs or File Paths.",
      optional: true,
      reloadProps: true,
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
  async additionalProps() {
    const props = {};
    if (this.fileUrls?.length) {
      for (const url of this.fileUrls) {
        props[`name_${url}`] = {
          type: "string",
          label: `New filename for "${url}"`,
          description: "Make sure to include the file extension",
        };
      }
    }
    if (this.filePaths?.length) {
      for (const filePath of this.filePaths) {
        props[`name_${filePath}`] = {
          type: "string",
          label: `New filename for "${filePath}"`,
          description: "Make sure to include the file extension",
        };
      }
    }
    return props;
  },
  async run({ $ }) {
    const {
      path,
      fileUrls,
      filePaths,
      autorename,
      mute,
      strictConflict,
      mode,
      ...fileProps
    } = this;

    if (!fileUrls?.length && !filePaths?.length) {
      throw new ConfigurationError("Must specify either File URLs or File Paths.");
    }

    const fileInfo = [];
    const normalizedPath = this.dropbox.getNormalizedPath(path, true);

    if (this.fileUrls?.length) {
      for (const url of fileUrls) {
        const filename = fileProps[`name_${url}`];
        fileInfo.push({
          contents: await got.stream(url),
          path: `${normalizedPath}${filename}`,
        });
      }
    }

    if (this.filePaths?.length) {
      for (const filePath of filePaths) {
        const filename = fileProps[`name_${filePath}`];
        fileInfo.push({
          contents: fs.createReadStream(filePath),
          path: `${normalizedPath}${filename}`,
        });
      }
    }

    const responses = [];
    for (const file of fileInfo) {
      const { result } = await this.dropbox.uploadFile({
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
