import app from "../../netsuite.app.mjs";

export default {
  key: "netsuite-get-sales-order",
  name: "Get Sales Order",
  description: "Retrieves a sales order by ID from NetSuite. [See the documentation](https://system.netsuite.com/help/helpcenter/en_US/APIs/REST_API_Browser/record/v1/2025.2/index.html#tag-salesOrder)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    salesOrderId: {
      propDefinition: [
        app,
        "salesOrderId",
      ],
    },
    expandSubResources: {
      propDefinition: [
        app,
        "expandSubResources",
      ],
    },
    simpleEnumFormat: {
      propDefinition: [
        app,
        "simpleEnumFormat",
      ],
    },
    fields: {
      propDefinition: [
        app,
        "fields",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      salesOrderId,
      expandSubResources,
      simpleEnumFormat,
      fields,
    } = this;

    const response = await app.getSalesOrder({
      $,
      salesOrderId,
      params: {
        expandSubResources,
        simpleEnumFormat,
        fields,
      },
    });

    $.export("$summary", `Successfully retrieved sales order with ID ${salesOrderId}`);
    return response;
  },
};
