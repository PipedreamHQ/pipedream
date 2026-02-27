import sharepoint from "../../sharepoint.app.mjs";
import fs from "fs";
import path from "path";
import { ConfigurationError } from "@pipedream/platform";
import constants from "../../common/constants.mjs";

export default {
  key: "sharepoint-download-file",
  name: "Download File",
  description: "Download a Microsoft Sharepoint file to the /tmp directory. [See the documentation](https://learn.microsoft.com/en-us/graph/api/driveitem-get-content?view=graph-rest-1.0&tabs=http)",
  version: "0.0.13",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    sharepoint,
    siteId: {
      propDefinition: [
        sharepoint,
        "siteId",
      ],
    },
    driveId: {
      propDefinition: [
        sharepoint,
        "driveId",
        (c) => ({
          siteId: c.siteId,
        }),
      ],
    },
    fileId: {
      propDefinition: [
        sharepoint,
        "fileId",
        (c) => ({
          siteId: c.siteId,
          driveId: c.driveId,
        }),
      ],
    },
    filename: {
      type: "string",
      label: "Filename",
      description: "The filename to save the downloaded file as in the `/tmp` directory",
    },
    convertToFormat: {
      type: "string",
      label: "Convert To Format",
      description: "The format to convert the file to. See the [Format Options](https://learn.microsoft.com/en-us/graph/api/driveitem-get-content-format?view=graph-rest-1.0&tabs=http#format-options) for supported source formats",
      options: [
        "pdf",
        "html",
      ],
      optional: true,
    },
    syncDir: {
      type: "dir",
      accessMode: "write",
      sync: true,
    },
  },
  methods: {
    async getOriginalFileData($) {
      const { name: originalFilename } = await this.sharepoint.getDriveItem({
        $,
        driveId: this.driveId,
        siteId: this.siteId,
        fileId: this.fileId,
      });
      const originalExtension = path.extname(originalFilename).slice(1)
        .toLowerCase() || undefined;
      return {
        originalFilename,
        originalExtension,
      };
    },
    formatNewFilename(originalExtension) {
      const parsed = path.parse(this.filename);
      if (this.convertToFormat) {
        const base = parsed.ext
          ? parsed.name
          : this.filename;
        return `${base}.${this.convertToFormat.toLowerCase()}`;
      }
      if (parsed.ext) {
        return this.filename;
      }
      return originalExtension
        ? `${this.filename}.${originalExtension}`
        : this.filename;
    },
    validateConversionFormat(originalExtension) {
      const supportedFormats = this.convertToFormat === "pdf"
        ? constants.PDF_CONVERTIBLE_FORMATS
        : this.convertToFormat === "html"
          ? constants.HTML_CONVERTIBLE_FORMATS
          : [];
      if (!supportedFormats.includes(originalExtension)) {
        throw new ConfigurationError(`The file extension "${originalExtension}" is not supported for conversion to "${this.convertToFormat}". Supported formats are: ${supportedFormats.join(", ")}`);
      }
    },
  },
  async run({ $ }) {
    const {
      originalFilename, originalExtension,
    } = await this.getOriginalFileData($);

    // ensure filename has an extension
    const filename = this.formatNewFilename(originalExtension);

    if (this.convertToFormat) {
      this.validateConversionFormat(originalExtension);
    }

    const response = await this.sharepoint.getFile({
      driveId: this.driveId,
      fileId: this.fileId,
      params: {
        format: this.convertToFormat,
      },
    });

    // Since the filepath is not returned as one of the standard keys (filePath
    // or path), save the file to STASH_DIR, if defined, so it is synced at the
    // end of execution.
    const downloadedFilepath = `${process.env.STASH_DIR || "/tmp"}/${filename}`;

    const chunks = [];
    for await (const chunk of response) {
      chunks.push(chunk);
    }

    const buffer = Buffer.concat(chunks);
    fs.writeFileSync(downloadedFilepath, buffer);

    const data = {
      filename,
      fileSize: `${buffer.length} bytes`,
      extension: this.convertToFormat || originalExtension,
      downloadedFilepath,
    };

    if (this.convertToFormat) {
      data.originalFilename = originalFilename;
      data.originalExtension = originalExtension;
    }

    return data;
  },
};
