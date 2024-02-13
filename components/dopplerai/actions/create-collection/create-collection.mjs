import dopplerai from "../../dopplerai.app.mjs";

export default {
  key: "dopplerai-create-collection",
  name: "Create Collection",
  description: "Establishes a new collection to save uploaded data. [See the documentation](https://api.dopplerai.com/docs/reference)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    dopplerai,
    collectionName: {
      propDefinition: [
        dopplerai,
        "collectionName",
      ],
    },
    visibility: {
      propDefinition: [
        dopplerai,
        "visibility",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.dopplerai.establishCollection(this.collectionName, this.visibility);
    $.export("$summary", `Successfully created collection with name ${this.collectionName}`);
    return response;
  },
};
