import ragie from "../../ragie.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "ragie-create-document",
  name: "Create Document",
  description: "Creates a new document in Ragie. [See the documentation](https://docs.ragie.ai/reference/createdocument)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    ragie,
    file: {
      propDefinition: [
        ragie,
        "createDocumentFile",
      ],
    },
    mode: {
      propDefinition: [
        ragie,
        "createDocumentMode",
      ],
      optional: true,
    },
    metadata: {
      propDefinition: [
        ragie,
        "createDocumentMetadata",
      ],
      optional: true,
    },
    externalId: {
      propDefinition: [
        ragie,
        "createDocumentExternalId",
      ],
      optional: true,
    },
    name: {
      propDefinition: [
        ragie,
        "createDocumentName",
      ],
      optional: true,
    },
    partition: {
      propDefinition: [
        ragie,
        "createDocumentPartition",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.ragie.createDocument({
      createDocumentFile: this.file,
      createDocumentMode: this.mode,
      createDocumentMetadata: this.metadata,
      createDocumentExternalId: this.externalId,
      createDocumentName: this.name,
      createDocumentPartition: this.partition,
    });

    $.export("$summary", `Created document: ${response.name} (ID: ${response.id})`);
    return response;
  },
};
