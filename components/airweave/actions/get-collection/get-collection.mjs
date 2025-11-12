import airweave from "../../airweave.app.mjs";

export default {
  key: "airweave-get-collection",
  name: "Get Collection",
  description: "Retrieve details of a specific collection by its readable ID. [See the documentation](https://docs.airweave.ai/api-reference/collections/get)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    airweave,
    collectionId: {
      propDefinition: [
        airweave,
        "collectionId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.airweave.getCollection(this.collectionId);

    $.export("$summary", `Successfully retrieved collection: ${response.name} (${response.readable_id})`);

    return response;
  },
};

