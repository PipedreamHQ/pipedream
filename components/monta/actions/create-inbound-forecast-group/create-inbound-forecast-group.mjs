// x-pd-ai: optimized
import monta from "../../monta.app.mjs";
import { parseJsonObjects } from "../../common/utils.mjs";

export default {
  key: "monta-create-inbound-forecast-group",
  name: "Create Inbound Forecast Group",
  description: "Create a new inbound forecast group describing stock expected at the warehouse. Manage the group afterwards with **Update Inbound Forecast Group**, **Get Inbound Forecast Group**, or **Delete Inbound Forecast Group**. [See the documentation](https://api-v6.monta.nl/index.html#tag/InboundForecast/paths/~1inboundforecast~1group/post)",
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
      description: "A unique reference for the new inbound forecast group",
    },
    inboundForecasts: {
      propDefinition: [
        monta,
        "inboundForecasts",
      ],
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
    const inboundForecasts = parseJsonObjects(this.inboundForecasts, "Inbound Forecast");

    const response = await this.monta.createInboundForecastGroup({
      $,
      data: {
        ...this.additionalFields,
        Reference: this.reference,
        InboundForecasts: inboundForecasts,
        SupplierCode: this.supplierCode,
        Comment: this.comment,
        WarehouseDisplayName: this.warehouseDisplayName,
        AllocateStockOnDelivery: this.allocateStockOnDelivery,
        ExpectedDeliveryDate: this.expectedDeliveryDate,
      },
    });

    $.export("$summary", `Successfully created inbound forecast group \`${this.reference}\``);

    return response;
  },
};
