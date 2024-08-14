import { ADDITIONAL_PROPS_SEARCH } from "../../common/props.mjs";
import rentman from "../../rentman.app.mjs";

export default {
  key: "rentman-find-item",
  name: "Find Item",
  description: "Searches for an item in the system using the item type as the filtering criteria. [See the documentation](https://api.rentman.net/)",
  version: "0.0.1",
  type: "action",
  props: {
    rentman,
    itemType: {
      propDefinition: [
        rentman,
        "itemType",
      ],
      reloadProps: true,
    },
  },
  async additionalProps() {
    if (this.itemType) {
      return {
        itemId: ADDITIONAL_PROPS_SEARCH[this.itemType],
      };
    }
  },
  async run({ $ }) {
    const response = await this.rentman.getItem({
      $,
      itemType: this.itemType,
      itemId: this.itemId,
    });

    $.export("$summary", `Successfully found item with ID ${this.itemId}`);
    return response;
  },
};
