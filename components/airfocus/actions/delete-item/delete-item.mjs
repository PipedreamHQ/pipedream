import airfocus from "../../airfocus.app.mjs";

export default {
  key: "airfocus-delete-item",
  name: "Delete Item",
  description: "Deletes a specific item in airfocus. [See the documentation](https://developer.airfocus.com/endpoints.html)",
  version: "0.0.1",
  type: "action",
  props: {
    airfocus,
    itemId: {
      propDefinition: [
        airfocus,
        "itemId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.airfocus.deleteItem({
      $,
      itemId: this.itemId,
    });

    $.export("$summary", `Successfully deleted item with ID ${this.itemId}`);
    return response;
  },
};
