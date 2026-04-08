import app from "../../box.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  name: "Get File Text",
  description: "Extracts text from a file in Box. [See the documentation](https://developer.box.com/guides/representations/text)",
  key: "box-get-file-text",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    folderId: {
      propDefinition: [
        app,
        "parentId",
      ],
      label: "Folder",
      description: "Folder containing the file to extract text from",
      optional: false,
    },
    fileId: {
      propDefinition: [
        app,
        "fileId",
        (c) => ({
          folderId: c.folderId,
        }),
      ],
      label: "File",
      description: "File to extract text from",
    },
  },
  async run({ $ }) {
    let entries;
    try {
      ({ representations: { entries } } = await this.app.getFile({
        $,
        fileId: this.fileId,
        params: {
          fields: "representations",
        },
        headers: {
          "x-rep-hints": "[extracted_text]",
        },
      }));
    } catch (error) {
      throw new ConfigurationError(`File not found: ${this.fileId}`);
    }

    const urlTemplate = entries.find((entry) => entry?.content?.url_template)?.content.url_template;
    if (!urlTemplate) {
      throw new ConfigurationError("File does not have a text representation");
    }

    const url = urlTemplate.replace("{+asset_path}", "");
    const response = await this.app._makeRequest({
      $,
      url,
    });

    $.export("$summary", "Successfully extracted text from file");

    return response;
  },
};
