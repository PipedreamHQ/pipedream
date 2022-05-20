import raindrop from "../../raindrop.app.mjs";
import fs from "fs";
import got from "got";
import stream from "stream";
import { promisify } from "util";
import FormData from "form-data";

export default {
  key: "raindrop-parse-bookmark-file",
  name: "Parse HTML Bookmark File",
  description: "Convert HTML bookmark file to JSON. Support Nestcape, Pocket and Instapaper file formats. [See the docs here](https://developer.raindrop.io/v1/import#parse-html-import-file)",
  version: "0.0.3",
  type: "action",
  props: {
    raindrop,
    fileUrl: {
      type: "string",
      label: "File URL",
      description: "The URL of the HTML bookmark file you want to convert. Must specify either File URL or File Path.",
      optional: true,
    },
    filePath: {
      type: "string",
      label: "File Path",
      description: "The path to the file, e.g. /tmp/bookmarks.html . Must specify either File URL or File Path.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      fileUrl,
      filePath,
    } = this;

    if (!fileUrl && !filePath) {
      throw new Error("Must specify either File URL or File Path");
    }

    const form = new FormData();
    if (filePath) {
      if (!fs.existsSync(filePath)) {
        throw new Error(`${filePath} does not exists`);
      }
      const readStream = fs.createReadStream(filePath);
      form.append("import", readStream);
    } else if (fileUrl) {
      const tempFilePath = "/tmp/temp_bookmarks.html";
      const pipeline = promisify(stream.pipeline);
      await pipeline(
        got.stream(fileUrl),
        fs.createWriteStream(tempFilePath),
      );
      const readStream = fs.createReadStream(tempFilePath);
      form.append("import", readStream);
    }

    const response = await this.raindrop.importFile($, form);
    $.export("$summary", "Successfully parsed bookmark file");
    return response;
  },
};
