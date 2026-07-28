import monta from "../../monta.app.mjs";
import { parseJsonObjects } from "../../common/utils.mjs";

export default {
  key: "monta-update-inbound-forecast-group",
  name: "Update Inbound Forecast Group",
  description: "Update an existing inbound forecast group by its reference. Find references with **List Inbound Forecast Groups** and inspect a group with **Get Inbound Forecast Group**. [See the documentation](https://api-v6.monta.nl/index.html#tag/InboundForecast/paths/~1inboundforecast~1group~1%7Breference%7D/put)",
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
    inboundForecasts: {
      propDefinition: [
        monta,
        "inboundForecasts",
      ],
      optional: true,
    },
    supplierCode: {
      propDefinition: [
        monta,
        "supplierCode",
      ],
      optional: true,
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
    allocateStockOnDelivery: {
      propDefinition: [
        monta,
        "allocateStockOnDelivery",
      ],
      optional: true,
    },
    expectedDeliveryDate: {
      propDefinition: [
        monta,
        "expectedDeliveryDate",
      ],
      optional: true,
    },
    deliveryDate: {
      propDefinition: [
        monta,
        "deliveryDate",
      ],
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
    const inboundForecasts = this.inboundForecasts
      ? parseJsonObjects(this.inboundForecasts, "Inbound Forecast")
      : undefined;

    const response = await this.monta.updateInboundForecastGroup({
      $,
      reference: this.reference,
      data: {
        ...this.additionalFields,
        Reference: this.reference,
        InboundForecasts: inboundForecasts,
        SupplierCode: this.supplierCode,
        Comment: this.comment,
        WarehouseDisplayName: this.warehouseDisplayName,
        AllocateStockOnDelivery: this.allocateStockOnDelivery,
        ExpectedDeliveryDate: this.expectedDeliveryDate,
        DeliveryDate: this.deliveryDate,
      },
    });

    $.export("$summary", `Successfully updated inbound forecast group \`${this.reference}\``);

    return response;
  },
};
