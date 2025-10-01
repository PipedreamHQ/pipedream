import orderspace from "../../orderspace.app.mjs";

export default {
  key: "orderspace-list-orders",
  name: "List Orders",
  description: "List a list of orders. [See the documentation](https://apidocs.orderspace.com/#list-orders)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    orderspace,
    createdSince: {
      type: "string",
      label: "Created Since",
      description: "Return records created since the given date and time in ISO 8601 format, e.g. 2019-10-29T21:00",
      optional: true,
    },
    createdBefore: {
      type: "string",
      label: "Created Before",
      description: "Return records created before the given date and time in ISO 8601 format, e.g. 2019-10-29T21:00",
      optional: true,
    },
    deliveryDateSince: {
      type: "string",
      label: "Delivery Date Since",
      description: "Return records with a delivery date since the given date and time in ISO 8601 format, e.g. 2019-10-29T21:00",
      optional: true,
    },
    deliveryDateBefore: {
      type: "string",
      label: "Delivery Date Before",
      description: "Return records with a delivery date before the given date and time in ISO 8601 format, e.g. 2019-10-29T21:00",
      optional: true,
    },
    number: {
      type: "string",
      label: "Number",
      description: "Return records with the specified number",
      optional: true,
    },
    status: {
      type: "string",
      label: "Status",
      description: "Return records with the specified status",
      options: [
        "new",
        "invoiced",
        "released",
        "part_fulfilled",
        "preorder",
        "fulfilled",
        "standing_order",
        "cancelled",
      ],
      optional: true,
    },
    reference: {
      type: "string",
      label: "Reference",
      description: "Return records with the specified reference",
      optional: true,
    },
    customerId: {
      propDefinition: [
        orderspace,
        "customerId",
      ],
      description: "Return records with the specified customer",
      optional: true,
    },
    maxResults: {
      propDefinition: [
        orderspace,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const { orders } = await this.orderspace.listOrders({
      $,
      params: {
        created_since: this.createdSince,
        created_before: this.createdBefore,
        delivery_date_since: this.deliveryDateSince,
        delivery_date_before: this.deliveryDateBefore,
        number: this.number,
        status: this.status,
        reference: this.reference,
        customer_id: this.customerId,
        limit: this.maxResults,
      },
    });
    $.export("$summary", `Successfully listed ${orders.length} orders`);
    return orders;
  },
};
