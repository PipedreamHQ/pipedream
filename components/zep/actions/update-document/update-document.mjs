import zep from "../../zep.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "zep-update-document",
  name: "Update Document",
  description: "Updates an existing document in Zep. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    zep: {
      type: "app",
      app: "zep",
    },
    documentId: {
      propDefinition: [
        "zep",
        "documentId",
      ],
    },
    fieldsToTrack: {
      propDefinition: [
        "zep",
        "fieldsToTrack",
      ],
    },
    title: {
      propDefinition: [
        "zep",
        "title",
      ],
      optional: true,
    },
    content: {
      propDefinition: [
        "zep",
        "content",
      ],
      optional: true,
    },
    metadata: {
      type: "string",
      label: "Metadata",
      description: "The metadata of the document",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.zep.updateDocument({
      documentId: this.documentId,
      fieldsToUpdate: this.fieldsToTrack,
    });
    $.export("$summary", `Document Updated: ${response.title}`);
    return response;
  },
};
