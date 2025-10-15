import common from "../common/base.mjs";
import constants from "../../common/constants.mjs";
import utils from "../../common/utils.mjs";

export default {
  name: "Get Items",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  key: "miro_custom_app-get-items",
  description: "Returns items on a Miro board. [See the docs](https://developers.miro.com/reference/get-items).",
  type: "action",
  props: {
    ...common.props,
    type: {
      type: "string",
      label: "Item Type",
      description: "If you want to get a list of items of a specific type, specify an item type. For example, if you want to retrieve the list of card items, set type to `card`",
      optional: true,
      options: constants.ITEM_TYPES_OPTIONS,
    },
  },
  async run({ $: step }) {
    const {
      boardId,
      type,
    } = this;

    const response = await this.app.listItems({
      step,
      boardId,
      params: {
        type,
        limit: constants.DEFAULT_LIMIT,
      },
    });

    step.export("$summary", `Successfully got ${utils.summaryEnd(response.data.length, "item")}`);

    return response.data;
  },
};
