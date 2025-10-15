import app from "../../lightspeed_ecom_c_series.app.mjs";

export default {
  key: "lightspeed_ecom_c_series-find-shipment",
  name: "Find Shipment",
  description: "Find a shipment by ID. [See the documentation](https://developers.lightspeedhq.com/ecom/endpoints/shipment/#get-all-shipments)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    customerId: {
      propDefinition: [
        app,
        "customerId",
      ],
      description: "Retrieve all shipments from a specific customer based on the customerid",
      optional: true,
    },
    orderNumber: {
      propDefinition: [
        app,
        "orderNumber",
      ],
      description: "Retrieve a shipment based on the order number",
      optional: true,
    },
    shipmentNumber: {
      propDefinition: [
        app,
        "shipmentNumber",
      ],
      optional: true,
    },
    sinceId: {
      type: "string",
      label: "Since ID",
      description: "Restrict results to after the specified ID",
      optional: true,
    },
    createdAtMin: {
      propDefinition: [
        app,
        "createdAtMin",
      ],
      description: "Show shipments created after date. **Format: `YYYY-MM-DD HH:MM:SS`**",
    },
    createdAtMax: {
      propDefinition: [
        app,
        "createdAtMax",
      ],
      description: "Show shipments created before date. **Format: `YYYY-MM-DD HH:MM:SS`**",
    },
    updatedAtMin: {
      propDefinition: [
        app,
        "updatedAtMin",
      ],
      description: "Show shipments last updated after date. **Format: `YYYY-MM-DD HH:MM:SS`**",
    },
    updatedAtMax: {
      propDefinition: [
        app,
        "updatedAtMax",
      ],
      description: "Show shipments last updated before date. **Format: `YYYY-MM-DD HH:MM:SS`**",
    },
  },
  async run({ $ }) {
    const response = this.app.paginate({
      fn: this.app.listShipment,
      $,
      params: {
        customer: this.customerId,
        order: this.orderNumber,
        number: this.shipmentNumber,
        since_id: this.sinceId,
        created_at_min: this.createdAtMin,
        created_at_max: this.createdAtMax,
        updated_at_min: this.updatedAtMin,
        updated_at_max: this.updatedAtMax,
      },
      dataField: "shipments",
    });

    const shipments = [];
    for await (const shipment of response) {
      shipments.push(shipment);
    }

    $.export("$summary", `Successfully found ${shipments.length} shipment${shipments.length === 1
      ? ""
      : "s"}`);
    return shipments;
  },
};
