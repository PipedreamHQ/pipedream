import options from "../../common/options.mjs";
import app from "../../order_desk.app.mjs";

export default {
  name: "List Orders",
  description: "List Orders based on a search criteria [See the documentation](https://apidocs.orderdesk.com/#get-multiple-orders).",
  key: "order_desk-list-orders",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    search_start_date_local: {
      type: "string",
      label: "Search Start Date Local",
      description: "Start date from when an order was added. Search in local store time.",
      optional: true,
    },
    search_end_date_local: {
      type: "string",
      label: "Search End Date Local",
      description: "End date from when an order was added. Search in local store time.",
      optional: true,
    },
    search_start_date: {
      type: "string",
      label: "Search Start Date",
      description: "Start date from when an order was added. Search in UTC time.",
      optional: true,
    },
    search_end_date: {
      type: "string",
      label: "Search End Date",
      description: "End date from when an order was added. Search in UTC time.",
      optional: true,
    },
    modified_start_date: {
      type: "string",
      label: "Modified Start Date",
      description: "Start date from when an order was last modified. Search in UTC time.",
      optional: true,
    },
    modified_end_date: {
      type: "string",
      label: "Modified End Date",
      description: "End date from when an order was last modified. Search in UTC time.",
      optional: true,
    },
    order_by: {
      type: "string",
      label: "Order By",
      description: "Order the query by an order field. Defaults to `date_added`",
      optional: true,
    },
    order: {
      type: "string",
      label: "Order",
      description: "Order the query by `asc` or `desc`. Defaults to `desc`",
      options: options.orderDir,
      optional: true,
    },
    folder_id: {
      propDefinition: [
        app,
        "folder_id",
      ],
      description: "Search for orders from a particular folder. For multiple folders, enter multiple ID's separated by a comma: `1004,1009,1010`",
    },
    folder_name: {
      type: "string",
      label: "Folder Name",
      description: "Search for orders from a particular folder. Enter the folder's exact name instead of its ID.",
      optional: true,
    },
    source_id: {
      propDefinition: [
        app,
        "source_id",
      ],
      description: "The Source Id",
    },
    source_name: {
      propDefinition: [
        app,
        "source_name",
      ],
      description: "The Source Name",
    },
  },
  async run({ $ }) {
    const {
      app,
      ...params
    } = this;
    const data = [];
    let page = 0;
    while (true) {
      const res = await app.listOrders(page, params);
      if (res.orders.length === 0) {
        break;
      }
      data.push(...res.orders);
      page++;
    }

    $.export("summary", `Successfully retrieved ${data.length} order(s).`);
    return data;
  },
};
