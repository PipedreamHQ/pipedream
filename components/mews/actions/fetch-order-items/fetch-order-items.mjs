import app from "../../mews.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  name: "Fetch Order Items",
  description: "Retrieve order items using Mews Connector API. [See the documentation](https://mews-systems.gitbook.io/connector-api/operations/orderitems#get-all-order-items)",
  key: "mews-fetch-order-items",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    additionalFields: {
      propDefinition: [
        app,
        "additionalFields",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      additionalFields,
    } = this;

    const items = await app.paginate({
      requester: app.orderItemsGetAll,
      requesterArgs: {
        $,
        data: utils.parseJson(additionalFields),
      },
      resultKey: "OrderItems",
    });
    $.export("summary", `Successfully fetched ${items.length} order items`);
    return items;
  },
};

