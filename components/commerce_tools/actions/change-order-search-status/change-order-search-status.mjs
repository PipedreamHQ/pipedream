import app from "../../commerce_tools.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "commerce_tools-change-order-search-status",
  name: "Change Order Search Status",
  description: "Activate or deactivate the [Order Search](https://docs.commercetools.com/api/projects/order-search) feature for the Project. Activation triggers building a search index for the Project's Orders (covering the last 3 months) and is required before the **Search Orders** action will work. [See the documentation](https://docs.commercetools.com/api/projects/project#change-order-search-status).",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    status: {
      type: "string",
      label: "Status",
      description: "Whether to activate or deactivate the Order Search feature.",
      options: constants.ORDER_SEARCH_STATUSES,
      default: constants.ORDER_SEARCH_STATUSES[0],
    },
  },
  async run({ $ }) {
    const { version } = await this.app.getProject({
      $,
    });
    const response = await this.app.updateProject({
      $,
      data: {
        version,
        actions: [
          {
            action: constants.CHANGE_ORDER_SEARCH_STATUS_ACTION,
            status: this.status,
          },
        ],
      },
    });
    $.export("$summary", `Successfully set Order Search status to \`${this.status}\``);
    return response;
  },
};
