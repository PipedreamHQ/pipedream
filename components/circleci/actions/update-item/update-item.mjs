import circleci from "../../circleci.app.mjs";

export default {
  key: "circleci-update-item",
  name: "Update Item",
  description: "Updates an existing item in CircleCI. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    circleci,
    itemId: {
      propDefinition: [
        circleci,
        "itemId",
      ],
    },
    updateFields: {
      propDefinition: [
        circleci,
        "updateFields",
      ],
      optional: false,
    },
  },
  async run({ $ }) {
    const response = await this.circleci.updateItem({
      itemId: this.itemId,
      updateFields: this.updateFields,
    });
    $.export("$summary", `Updated item with ID ${this.itemId}`);
    return response;
  },
};
