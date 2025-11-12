import dopplerai from "../../dopplerai.app.mjs";

export default {
  key: "dopplerai-create-collection",
  name: "Create Collection",
  description: "Establishes a new collection to save uploaded data. [See the documentation](https://api.dopplerai.com/docs/reference#tag/Collections/operation/create_collection_v1_collections_post)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    dopplerai,
    referenceId: {
      propDefinition: [
        dopplerai,
        "referenceId",
      ],
    },
    name: {
      propDefinition: [
        dopplerai,
        "name",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.dopplerai.createCollection({
      $,
      data: {
        reference_id: this.referenceId,
        name: this.name,
      },
    });
    $.export("$summary", `Successfully created collection with UUID ${response.uuid}`);
    return response;
  },
};
