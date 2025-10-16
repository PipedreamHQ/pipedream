import app from "../../dachser.app.mjs";

export default {
  name: "Get Shipment History",
  description: "Retrieve the full history for a shipment by tracking number and customer ID. [See the documentation](https://api-portal.dachser.com/bi.b2b.portal/api/library/shipmenthistory?5)",
  key: "dachser-get-shipment-history",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    trackingNumber: {
      propDefinition: [
        app,
        "trackingNumber",
      ],
    },
    customerId: {
      propDefinition: [
        app,
        "customerId",
      ],
    },
    acceptLanguage: {
      propDefinition: [
        app,
        "acceptLanguage",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      acceptLanguage,
      trackingNumber,
      customerId,
    } = this;

    const response = await app.getShipmentHistory({
      $,
      params: {
        "tracking-number": trackingNumber,
        "customer-id": customerId,
      },
      headers: {
        "Accept-Language": acceptLanguage,
      },
    });

    $.export("$summary", `Successfully retrieved shipment history for \`${response.shipments?.length ?? 0}\` shipments.`);

    return response;
  },
};

