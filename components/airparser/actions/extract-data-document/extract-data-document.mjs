import airparser from "../../airparser.app.mjs";

export default {
  key: "airparser-extract-data-document",
  name: "Extract Data from Document",
  description: "Extracts structured data based on a user-predefined extraction schema. [See the documentation](https://help.airparser.com/public-api/public-api)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    airparser,
    inboxId: {
      propDefinition: [
        airparser,
        "inboxId",
      ],
    },
    documentId: {
      propDefinition: [
        airparser,
        "documentId",
        (c) => ({
          inboxId: c.inboxId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.airparser.getDocument({
      $,
      documentId: this.documentId,
    });
    $.export("$summary", `Successfully extracted data for document with ID ${this.documentId}`);
    return response;
  },
};
