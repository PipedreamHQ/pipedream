import egnyte from "../../egnyte.app.mjs";
import fs from "fs";
import path from "path";

export default {
  key: "egnyte-download-file",
  name: "Download File",
  description: "Download a file from Egnyte and save it under `/tmp`. For common text-based types (for example `text/*`, JSON, XML, CSV, Markdown), the response can include a `content` string with the file body. [See the documentation](https://developers.egnyte.com/api-docs/read/file-system-management-api-documentation)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    egnyte,
    folderPath: {
      propDefinition: [
        egnyte,
        "folderPath",
      ],
      description: "The path to the folder containing the file to download. Search for a folder to select or enter a folder path manually.",
    },
    filename: {
      propDefinition: [
        egnyte,
        "filename",
        (c) => ({
          folderPath: c.folderPath,
        }),
      ],
    },
    returnContent: {
      type: "boolean",
      label: "Return Content",
      description: "Whether to return the content of the file as a string. If `true`, the response will include a `content` string with the file body. Only available for common text-based types (for example `text/*`, JSON, XML, CSV, Markdown).",
      optional: true,
    },
    syncDir: {
      type: "dir",
      accessMode: "write",
      sync: true,
    },
  },
  methods: {
    _isTextFile(contentType, ext) {
      const TEXT_EXTENSIONS = new Set([
        ".txt",
        ".csv",
        ".tsv",
        ".json",
        ".xml",
        ".html",
        ".htm",
        ".css",
        ".js",
        ".mjs",
        ".cjs",
        ".ts",
        ".tsx",
        ".jsx",
        ".md",
        ".markdown",
        ".log",
        ".yml",
        ".yaml",
        ".svg",
        ".env",
        ".sh",
        ".ini",
        ".cfg",
        ".toml",
        ".sql",
      ]);
      if (ext && TEXT_EXTENSIONS.has(ext.toLowerCase())) {
        return true;
      }
      if (!contentType) {
        return false;
      }
      const base = contentType.split(";")[0].trim().toLowerCase();
      if (base.startsWith("text/")) {
        return true;
      }
      const textApplicationTypes = new Set([
        "application/json",
        "application/xml",
        "application/javascript",
        "application/x-www-form-urlencoded",
        "application/csv",
      ]);
      if (textApplicationTypes.has(base)) {
        return true;
      }
      if (base.endsWith("+json") || base.endsWith("+xml")) {
        return true;
      }
      return false;
    },
  },
  async run({ $ }) {
    const res = await this.egnyte.downloadFile({
      $,
      folderPath: this.folderPath,
      filename: this.filename,
      returnFullResponse: true,
    });
    const buffer = Buffer.from(res.data);
    const filename = path.basename(this.filename);
    const filepath = `/tmp/${filename}`;
    fs.writeFileSync(filepath, buffer);

    const ext = path.extname(filename);
    const contentType = res.headers?.["content-type"];
    const result = {
      filepath,
      filename,
    };
    if (this._isTextFile(contentType, ext) && this.returnContent) {
      result.content = buffer.toString("utf8");
    }

    $.export("$summary", `Downloaded file to ${filepath}`);
    return result;
  },
};
