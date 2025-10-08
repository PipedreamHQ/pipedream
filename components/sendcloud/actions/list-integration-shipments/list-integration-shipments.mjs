import app from "../../sendcloud.app.mjs";

export default {
  key: "sendcloud-list-integration-shipments",
  name: "List Integration Shipments",
  description: "List integration shipments. [See the documentation](https://api.sendcloud.dev/docs/sendcloud-public-api/branches/v2/integrations/operations/list-integration-shipments)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    integrationId: {
      propDefinition: [
        app,
        "integrationId",
      ],
    },
    senderAddress: {
      propDefinition: [
        app,
        "senderAddress",
      ],
    },
    externalOrderIds: {
      type: "string[]",
      label: "External Order IDs",
      description: "Filter to shipments where `external_order_id` matches one of these values.",
      optional: true,
    },
    externalShipmentIds: {
      type: "string[]",
      label: "External Shipment IDs",
      description: "Filter to shipments where `external_shipment_id` matches one of these values.",
      optional: true,
    },
    endDate: {
      type: "string",
      label: "End Date",
      description: "Displays orders up to the given date (inclusive). Format: `YYYY-MM-DD`. Defaults to current date.",
      optional: true,
    },
    orderNumber: {
      type: "string",
      label: "Order Number",
      description: "Filter to shipments matching this order number.",
      optional: true,
    },
    shippingRules: {
      type: "boolean",
      label: "Enable Shipping Rules",
      description: "Enable shipping rules when retrieving orders (impacts `allowed_shipping_methods`).",
      optional: true,
    },
    startDate: {
      type: "string",
      label: "Start Date",
      description: "Displays orders from the given date (inclusive). Format: `YYYY-MM-DD`. Defaults to one year ago.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      app,
      integrationId,
      endDate,
      externalOrderIds,
      externalShipmentIds,
      orderNumber,
      senderAddress,
      shippingRules,
      startDate,
    } = this;

    const response = await app.paginate({
      requester: app.listIntegrationShipments,
      requesterArgs: {
        $,
        integrationId,
        params: {
          end_date: endDate,
          external_order_ids: externalOrderIds,
          external_shipment_ids: externalShipmentIds,
          order_number: orderNumber,
          sender_address: senderAddress,
          shipping_rules: shippingRules,
          start_date: startDate,
        },
      },
      resultsKey: "results",
    });

    $.export("$summary", `Successfully retrieved \`${response.length}\` integration shipment(s)`);

    return response;
  },
};

