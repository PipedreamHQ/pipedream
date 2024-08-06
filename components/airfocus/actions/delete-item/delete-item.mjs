import airfocus from "../../airfocus.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "airfocus-delete-item",
  name: "Delete Item",
  description: "Deletes a specific item in airfocus. [See the documentation](https://developer.airfocus.com/endpoints.html)",
  version: "0.0.{{ts}}",
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
      ],
    },
  },
  async run({ $ }) {
    const response = await this.airfocus.deleteItem(this.workspaceId, this.itemId);
    $.export("$summary", `Successfully deleted item with ID ${this.itemId}`);
    return response;
  },
};
