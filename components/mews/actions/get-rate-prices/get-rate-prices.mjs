import app from "../../mews.app.mjs";

export default {
  name: "Get Rate Prices",
  description: "Get rate pricing information for a specific rate and time period. [See the documentation](https://mews-systems.gitbook.io/connector-api/operations/rates#get-rate-pricing)",
  key: "mews-get-rate-prices",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    rateId: {
      propDefinition: [
        app,
        "rateId",
      ],
      description: "Unique identifier of the Rate.",
    },
    productId: {
      propDefinition: [
        app,
        "productId",
      ],
      description: "Unique identifier of the Product.",
      optional: true,
    },
    firstTimeUnitStartUtc: {
      type: "string",
      label: "First Time Unit Start (UTC)",
      description: "Start of the time interval, expressed as the timestamp for the start of the first time unit, in UTC timezone ISO 8601 format.",
    },
    lastTimeUnitStartUtc: {
      type: "string",
      label: "Last Time Unit Start (UTC)",
      description: "End of the time interval, expressed as the timestamp for the start of the last time unit, in UTC timezone ISO 8601 format. The maximum size of time interval depends on the service's time unit: 367 hours if hours, 367 days if days, or 24 months if months.",
    },
  },
  async run({ $ }) {
    const {
      app,
      rateId,
      productId,
      firstTimeUnitStartUtc,
      lastTimeUnitStartUtc,
    } = this;

    const response = await app.ratesGetPricing({
      $,
      data: {
        RateId: rateId,
        ProductId: productId,
        FirstTimeUnitStartUtc: firstTimeUnitStartUtc,
        LastTimeUnitStartUtc: lastTimeUnitStartUtc,
      },
    });

    $.export("$summary", "Successfully retrieved pricing for rate");

    return response;
  },
};
