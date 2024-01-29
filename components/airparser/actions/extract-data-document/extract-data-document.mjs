import airparser from "../../airparser.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "airparser-extract-data-document",
  name: "Extract Data from Document",
  description: "Imports a document and extracts structured data based on a user-predefined extraction schema. The document source can be a file, text, or an external URL. The user needs to define the extraction schema as a required prop.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    airparser,
    extractionSchema: {
      type: "string",
      label: "Extraction Schema",
      description: "The user-defined extraction schema for data extraction",
    },
    documentSource: {
      type: "string",
      label: "Document Source",
      description: "The source of the document for data extraction (file, text, or external URL)",
    },
  },
  async run({ $ }) {
    const response = await this.airparser.importDocument(this.documentSource, this.extractionSchema);
    const documentId = response.id;
    const documentData = await this.airparser.getDocument(documentId);
    $.export("$summary", `Successfully extracted data from document with ID: ${documentId}`);
    return documentData;
  },
};
