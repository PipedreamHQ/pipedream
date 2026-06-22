import fs from "fs";
import stream from "stream";
import util from "util";
import path from "path";
import onedrive from "../../microsoft_onedrive.app.mjs";
import httpRequest from "../../common/httpRequest.mjs";
import { ConfigurationError } from "@pipedream/platform";
import constants from "../../common/constants.mjs";

export default {
  name: "Download File",
  description: "Download a file stored in OneDrive. [See the documentation](https://learn.microsoft.com/en-us/onedrive/developer/rest-api/api/driveitem_get_content?view=odsp-graph-online)",
  key: "microsoft_onedrive-download-file",
  version: "0.0.10",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    onedrive,
    fileId: {
      propDefinition: [
        onedrive,
        "fileId",
      ],
      optional: true,
    },
    filePath: {
      type: "string",
      label: "File Path",
      description: "The path to the file from the root folder, e.g., `Documents/My Subfolder/File 1.docx`. You can either provide this, or search for an existing file with the `File ID` prop.",
      optional: true,
    },
    newFileName: {
      type: "string",
      label: "New File Name",
      description: "The file name to save the downloaded content as, under the `/tmp` folder. Make sure to include the file extension.",
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
    httpRequest,
    async getOriginalFileExtension($) {
      const url = this.fileId
        ? `items/${this.fileId}`
        : `/root:/${encodeURI(this.filePath)}`;
      const { name: originalFilename } = await this.httpRequest({
        $,
        url,
      });
      const originalExtension = path.extname(originalFilename).slice(1)
        .toLowerCase() || undefined;
      return originalExtension;
    },
    formatNewFilename(newFileName, originalExtension) {
      const parsed = path.parse(newFileName);
      if (this.convertToFormat) {
        const base = parsed.ext
          ? parsed.name
          : newFileName;
        return `${base}.${this.convertToFormat.toLowerCase()}`;
      }
      if (parsed.ext) {
        return newFileName;
      }
      return originalExtension
        ? `${newFileName}.${originalExtension}`
        : newFileName;
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
      fileId, filePath, newFileName,
    } = this;

    if (!fileId && !filePath) {
      throw new ConfigurationError("You must specify either **File ID** or **File Path**.");
    }

    const url = fileId
      ? `items/${fileId}/content`
      : `/root:/${encodeURI(filePath)}:/content`;

    const originalExtension = await this.getOriginalFileExtension($);

    const formattedFilename = this.formatNewFilename(newFileName, originalExtension);

    if (this.convertToFormat) {
      this.validateConversionFormat(originalExtension);
    }

    let response;
    try {
      response = await this.httpRequest({
        $,
        url,
        responseType: "stream",
        params: this.convertToFormat
          ? {
            format: this.convertToFormat,
          }
          : undefined,
      });
    } catch {
      throw new ConfigurationError(`Error accessing file. Please make sure that the ${ fileId
        ? "File ID"
        : "File Path"} is correct.`);
    }

    const fileName = formattedFilename.split("/").pop();
    const tmpFilePath = `/tmp/${fileName}`;

    const pipeline = util.promisify(stream.pipeline);
    await pipeline(response, fs.createWriteStream(tmpFilePath));

    $.export("$summary", `Returned file contents and saved to \`${tmpFilePath}\`.`);
    return tmpFilePath;
  },
};
