import airparser from "../../airparser.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "airparser-upload-document-parse",
  name: "Upload Document and Parse",
  description: "Uploads a document into the inbox for data extraction. The parsed results depend on a predefined extraction schema. The document source is required as a prop. Additionally, users may define the extraction schema as an optional prop.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    airparser,
    documentSource: {
      type: "string",
      label: "Document Source",
      description: "The source of the document for data extraction (file, text, or external URL)",
    },
    extractionSchema: {
      type: "string",
      label: "Extraction Schema",
      description: "The user-defined extraction schema for data extraction",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.airparser.uploadDocument(this.documentSource, this.extractionSchema);
    $.export("$summary", `Uploaded document with ID: ${response.id}`);
    return response;
  },
};
