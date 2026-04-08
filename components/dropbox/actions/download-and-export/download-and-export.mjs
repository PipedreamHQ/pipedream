import dropbox from "../../dropbox.app.mjs";
import fs from "fs";
import got from "got";
import stream from "stream";
import { promisify } from "util";
import { checkTmp } from "../../common/utils.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  name: "Download and Export",
  description: "Export a file from a user's Dropbox. If file is not exportable, it will be downloaded in original format. [See the documentation](https://www.dropbox.com/developers/documentation/http/documentation#files-export)",
  key: "dropbox-download-and-export",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    dropbox,
    path: {
      propDefinition: [
        dropbox,
        "path",
      ],
      description: "Type the file name to search for it in the user's Dropbox.",
    },
    name: {
      type: "string",
      label: "File Name",
      description: "The new name of the file to be saved, including its extension. e.g: `myFile.html`.",
    },
    exportFormat: {
      propDefinition: [
        dropbox,
        "exportFormat",
        (c) => ({
          path: c.path,
        }),
      ],
    },
    syncDir: {
      type: "dir",
      accessMode: "write",
      sync: true,
    },
  },
  async run({ $ }) {
    const path = this.dropbox.getNormalizedPath(this.path, false);
    let filePath = null;
    const extension = path.split(".").pop();
    const newFilename = this.name?.split(".").slice(0, -1);
    const newExtension = this.name?.split(".").pop();

    const { result } = await this.dropbox.filesGetMetadata({
      path,
    });

    if (!this.exportFormat || !result?.export_info) {
      // download in original format
      try {
        const linkResponse = await this.dropbox.filesGetTemporaryLink({
          path,
        });

        if (!linkResponse || !linkResponse.result) {
          throw new Error("Failed to get temporary download link from Dropbox");
        }

        const {
          link, metadata,
        } = linkResponse.result;

        const fileName = this.name
          ? extension === newExtension
            ? this.name
            : `${newFilename}.${extension}`
          : metadata.name;
        const cleanFileName = fileName.replace(/[?$#&{}[\]<>*!@:+\\/]/g, "");

        filePath = checkTmp(cleanFileName);
        const pipeline = promisify(stream.pipeline);

        await pipeline(
          got.stream(link),
          fs.createWriteStream(filePath),
        );
      } catch (error) {
        throw new Error(`Failed to download file: ${error.message}`);
      }

      $.export("$summary", `Successfully downloaded file in original format to "${filePath}"`);
    }
    else {
      if (!result?.export_info?.export_options?.includes(this.exportFormat)) {
        throw new ConfigurationError("Export format not supported for this file");
      }

      // export file in specified format

      try {
        const { result: { fileBinary } } = await this.dropbox.exportFile({
          path,
          export_format: this.exportFormat,
        });
        filePath = checkTmp(this.name);
        fs.writeFileSync(filePath, fileBinary);
      } catch (error) {
        throw new Error(`Failed to export file: ${error.message}`);
      }

      $.export("$summary", `Successfully exported file to ${this.exportFormat} format`);
    }

    return {
      filePath,
    };
  },
};
