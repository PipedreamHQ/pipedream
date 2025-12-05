import { STATUS_OPTIONS } from "../../common/constants.mjs";
import picqer from "../../picqer.app.mjs";

export default {
  key: "picqer-search-orders",
  name: "Search Picqer Orders",
  description: "Search for orders in Picqer. [See the documentation](https://picqer.com/en/api/orders#get-all-orders)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    picqer,
    search: {
      type: "string",
      label: "Search",
      description: "Search through the fields orderid, reference, customer name and customer contact name.",
      optional: true,
    },
    sinceId: {
      type: "string",
      label: "Since ID",
      description: "Get the orders with a later idorder than given.",
      optional: true,
    },
    beforeId: {
      type: "string",
      label: "Before ID",
      description: "Get the orders with a smaller idorder than given.",
      optional: true,
    },
    sinceDate: {
      type: "string",
      label: "Since Date",
      description: "Get the orders that are added after this date and time. **Format: YYYY-MM-DD HH:MM:SS**",
      optional: true,
    },
    untilDate: {
      type: "string",
      label: "Until Date",
      description: "Get the orders that are added before this date and time. **Format: YYYY-MM-DD HH:MM:SS**",
      optional: true,
    },
    status: {
      type: "string",
      label: "Status",
      description: "Get the orders that have this status.",
      options: STATUS_OPTIONS,
      optional: true,
    },
    reference: {
      type: "string",
      label: "Reference",
      description: "Get the orders that have this value as reference.",
      optional: true,
    },
    emailAddress: {
      type: "string",
      label: "Email Address",
      description: "Get the orders that have this value as email address.",
      optional: true,
    },
    customerId: {
      propDefinition: [
        picqer,
        "customerId",
      ],
      description: "Get all orders for this customer.",
      optional: true,
    },
    warehouseId: {
      propDefinition: [
        picqer,
        "warehouseId",
      ],
      description: "Get the orders that can be delivered from this warehouse.",
      optional: true,
    },
    fulfillmentCustomerId: {
      propDefinition: [
        picqer,
        "fulfillmentCustomerId",
      ],
      description: "Get the orders for this fulfilment.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.picqer.searchOrders({
      $,
      params: {
        search: this.search,
        sinceid: this.sinceId,
        beforeid: this.beforeId,
        sincedate: this.sinceDate,
        untildate: this.untilDate,
        status: this.status,
        reference: this.reference,
        emailaddress: this.emailAddress,
        idcustomer: this.customerId,
        idwarehouse: this.warehouseId,
        idfulfilment_customer: this.fulfillmentCustomerId,
      },
    });

    $.export("$summary", `Orders found: ${response.length}`);
    return response;
  },
};
