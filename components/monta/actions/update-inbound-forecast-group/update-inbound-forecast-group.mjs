// x-pd-ai: optimized
import monta from "../../monta.app.mjs";

export default {
  key: "monta-update-inbound-forecast-group",
  name: "Update Inbound Forecast Group",
  description: "Update an existing inbound forecast group's details by its reference: its comment, warehouse, or expected delivery date. The forecasts, supplier, and stock-allocation flag are set at creation and cannot be changed here. [See the documentation](https://api-v6.monta.nl/index.html#tag/InboundForecast/paths/~1inboundforecast~1group~1%7Breference%7D/put)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    monta,
    reference: {
      propDefinition: [
        monta,
        "reference",
      ],
      description: "The reference of the inbound forecast group to update. Use the **List Inbound Forecast Groups** action to find available references.",
    },
    comment: {
      propDefinition: [
        monta,
        "comment",
      ],
      optional: true,
    },
    warehouseDisplayName: {
      propDefinition: [
        monta,
        "warehouseDisplayName",
      ],
      optional: true,
    },
    expectedDeliveryDate: {
      propDefinition: [
        monta,
        "expectedDeliveryDate",
      ],
      description: "The expected delivery date in ISO 8601 format (e.g. `2026-07-24T14:30:00Z`). Updating this also updates the expected delivery date of the group's unapproved forecasts.",
      optional: true,
    },
    additionalFields: {
      propDefinition: [
        monta,
        "additionalFields",
      ],
      description: "Additional properties to send in the request body, using Monta's request-body casing (e.g. `{ \"UniqueId\": \"...\" }`)",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.monta.updateInboundForecastGroup({
      $,
      reference: this.reference,
      data: {
        ...this.additionalFields,
        Reference: this.reference,
        Comment: this.comment,
        WarehouseDisplayName: this.warehouseDisplayName,
        ExpectedDeliveryDate: this.expectedDeliveryDate,
      },
    });

    $.export("$summary", `Successfully updated inbound forecast group \`${this.reference}\``);

    return response;
  },
};
