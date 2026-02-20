import fs from "fs";
import got from "got";
import stream from "stream";
import { promisify } from "util";
import { checkTmp } from "../../common/utils.mjs";
import dropbox from "../../dropbox.app.mjs";

export default {
  name: "Download File to TMP",
  description: "Download a specific file to the temporary directory. [See the documentation](https://dropbox.github.io/dropbox-sdk-js/Dropbox.html#filesDownload__anchor).",
  key: "dropbox-download-file-to-tmp",
  version: "0.0.11",
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
          initialOptions: [],
        }),
      ],
    },
    name: {
      type: "string",
      label: "File Name",
      description: "The new name of the file to be saved, including its extension. e.g: `myFile.csv`",
      optional: true,
    },
    syncDir: {
      type: "dir",
      accessMode: "write",
      sync: true,
    },
  },
  async run({ $ }) {
    try {
      const linkResponse = await this.dropbox.filesGetTemporaryLink({
        path: this.dropbox.getNormalizedPath(this.path, false),
      });

      console.log("linkResponse: ", linkResponse);

      if (!linkResponse || !linkResponse.result) {
        throw new Error("Failed to get temporary download link from Dropbox");
      }

      const {
        link, metadata,
      } = linkResponse.result;

      const fileName = this.name || metadata.name;
      const cleanFileName = fileName.replace(/[?$#&{}[]<>\*!@:\+\\\/]/g, "");

      const tmpPath = checkTmp(cleanFileName);
      const pipeline = promisify(stream.pipeline);

      await pipeline(
        got.stream(link),
        fs.createWriteStream(tmpPath),
      );

      $.export("$summary", `File successfully saved in "${tmpPath}"`);

      return {
        tmpPath,
        ...metadata,
      };
    } catch (error) {
      throw new Error(`Failed to download file: ${error.message}`);
    }
  },
};
