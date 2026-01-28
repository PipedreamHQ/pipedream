import raindrop from "../../raindrop.app.mjs";
import { getFileStreamAndMetadata } from "@pipedream/platform";
import FormData from "form-data";

export default {
  key: "raindrop-parse-bookmark-file",
  name: "Parse HTML Bookmark File",
  description: "Convert an HTML bookmark file to JSON. Supports Nestcape, Pocket and Instapaper file formats. [See the documentation](https://developer.raindrop.io/v1/import#parse-html-import-file)",
  version: "1.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    raindrop,
    filePath: {
      type: "string",
      label: "File Path or URL",
      description: "The file to parse. Provide either a file URL or a path to a file in the `/tmp` directory (for example, `/tmp/bookmarks.html`)",
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
    },
  },
  async run({ $ }) {
    const form = new FormData();
    const {
      stream, metadata,
    } = await getFileStreamAndMetadata(this.filePath);
    form.append("import", stream, {
      contentType: metadata.contentType,
      knownLength: metadata.size,
      filename: metadata.name,
    });

    const response = await this.raindrop.importFile($, form);
    $.export("$summary", "Successfully parsed bookmark file");
    return response;
  },
};
