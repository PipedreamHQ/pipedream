import dropbox from "../../dropbox.app.mjs";
import get from "lodash/get.js";
import isNil from "lodash/isNil.js";
import isEmpty from "lodash/isEmpty.js";

export default {
  name: "Create or Append to a Text File",
  description: "Adds a new line to an existing text file, or creates a file if it doesn't exist. [See docs here](https://dropbox.github.io/dropbox-sdk-js/Dropbox.html#filesUpload__anchor)",
  key: "dropbox-create-or-append-to-a-text-file",
  version: "0.0.14",
  type: "action",
  props: {
    dropbox,
    name: {
      type: "string",
      label: "File name",
      description: "Your new file name.",
    },
    path: {
      propDefinition: [
        dropbox,
        "pathFolder",
      ],
      optional: true,
      description: "The Path in the user's Dropbox to create or append in the file. If not filled, it will be created on the root folder. (Please use a valid path to filter the values)",
    },
    content: {
      type: "string",
      label: "Content",
      description: "The content to be written",
    },
  },
  methods: {
    getNormalizedPath(path, name) {
      // Normalize path
      let normalizedPath = get(path, "value", path);

      if (isNil(normalizedPath) || isEmpty(normalizedPath)) {
        normalizedPath = "/";
      } else if (normalizedPath[normalizedPath.length - 1] !== "/") {
        normalizedPath += "/";
      }
      normalizedPath += name;
      return normalizedPath;
    },
    async getFileInfo(path, content) {
      let file;
      try {
        file = await this.dropbox.downloadFile({
          path,
        });
      } catch {
        file = null;
      }

      return {
        fileExists: !!(file?.result?.fileBinary),
        content: file?.result?.fileBinary
          ? file.result.fileBinary.toString() + content
          : content,
      };
    },
    getArgs(fileExists, content, normalizedPath) {
      return {
        contents: Buffer.from(content),
        path: normalizedPath,
        autorename: !fileExists,
        mode: fileExists
          ? {
            ".tag": "overwrite",
          }
          : undefined,
      };
    },
  },
  async run({ $ }) {
    const {
      name,
      content,
      path,
    } = this;

    const normalizedPath = this.getNormalizedPath(path, name);
    const {
      fileExists,
      content: normalizedContent,
    } = await this.getFileInfo(normalizedPath, content);

    const res = await this.dropbox.uploadFile(this.getArgs(
      fileExists,
      normalizedContent,
      normalizedPath,
    ));

    // eslint-disable-next-line multiline-ternary
    $.export("$summary", fileExists ? "Text successfully appended to the file" : "Text file successfully created");
    return res;
  },
};
