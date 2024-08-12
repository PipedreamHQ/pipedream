import rentman from "../../rentman.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "rentman-find-item",
  name: "Find Item",
  description: "Searches for an item in the system using the item type as the filtering criteria. [See the documentation](https://api.rentman.net/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    rentman,
    itemType: {
      propDefinition: [
        rentman,
        "itemType",
      ],
    },
    itemId: {
      propDefinition: [
        rentman,
        "itemId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.rentman.searchItem({
      itemType: this.itemType,
      itemId: this.itemId,
    });

    $.export("$summary", `Successfully found item with ID ${this.itemId}`);
    return response;
  },
};
