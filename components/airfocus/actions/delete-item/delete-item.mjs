import airfocus from "../../airfocus.app.mjs";

export default {
  key: "airfocus-delete-item",
  name: "Delete Item",
  description: "Deletes a specific item in airfocus. [See the documentation](https://developer.airfocus.com/endpoints.html)",
  version: "0.1.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    airfocus,
    workspaceId: {
      propDefinition: [
        airfocus,
        "workspaceId",
      ],
    },
    itemId: {
      propDefinition: [
        airfocus,
        "itemId",
        ({ workspaceId }) => ({
          workspaceId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.airfocus.deleteItem({
      $,
      workspaceId: this.workspaceId,
      itemId: this.itemId,
    });

    $.export("$summary", `Successfully deleted item with ID ${this.itemId}`);
    return response;
  },
};
