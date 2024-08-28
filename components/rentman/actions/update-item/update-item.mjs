import {
  ADDITIONAL_PROPS, ADDITIONAL_PROPS_SEARCH,
} from "../../common/props.mjs";
import { snakeCaseData } from "../../common/utils.mjs";
import rentman from "../../rentman.app.mjs";

export default {
  key: "rentman-update-item",
  name: "Update Rentman Item",
  description: "Updates the details of an existing item based on its type. [See the documentation](https://api.rentman.net)",
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
      const item = ADDITIONAL_PROPS_SEARCH[this.itemType];
      return {
        itemId: {
          ...item,
          description: `${item.description} to update.`,
        },
        ...ADDITIONAL_PROPS[this.itemType],
      };
    }
  },
  async run({ $ }) {
    const {
      rentman,
      itemType,
      itemId,
      ...data
    } = this;

    const response = await rentman.updateItem({
      $,
      itemType,
      itemId,
      data: snakeCaseData(data),
    });

    $.export("$summary", `Successfully updated item with ID ${itemId}`);
    return response;
  },
};
