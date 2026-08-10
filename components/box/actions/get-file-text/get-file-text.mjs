// x-pd-ai: optimized
import app from "../../box.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  name: "Get File Text",
  description: "Extracts the text content of a Box file using its `extracted_text` representation. Works for office documents, presentations, spreadsheets, PDFs, and plain-text or code files. Box does not generate this representation for images (they have no text layer) or for files larger than 500 MB, and the action fails with an error when the file has no text representation. Use **Download File** to fetch the raw file instead. [See the documentation](https://developer.box.com/guides/representations/text)",
  key: "box-get-file-text",
  version: "0.0.2",
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
      description: "The folder containing the file to extract text from. Use `0` for the root folder. Use the **List Folders** action to retrieve folder IDs.",
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
      description: "The file to extract text from (e.g. `123456789`). Use the **List Folder Items** action to retrieve file IDs.",
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
