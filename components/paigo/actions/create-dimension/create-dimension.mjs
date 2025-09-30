import paigo from "../../paigo.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "paigo-create-dimension",
  name: "Create Dimension",
  description: "Creates a new dimension inside the Paigo platform. [See the documentation](http://www.api.docs.paigo.tech/#tag/Dimensions/operation/Create%20a%20dimension)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    paigo,
    dimensionName: {
      type: "string",
      label: "Dimension Name",
      description: "A friendly, human-readable name for the dimension",
    },
    consumptionUnitType: {
      type: "string",
      label: "Consumption Unit Type",
      description: "Consumption unit type of the dimension",
      options: Object.keys(constants.CONSUMPTION_UNITS),
    },
    consumptionUnit: {
      type: "string",
      label: "Consumption Unit",
      description: "Consumption unit type of the dimension",
      options() {
        return constants.CONSUMPTION_UNITS[this.consumptionUnitType] || [];
      },
    },
    usageIncrement: {
      type: "string",
      label: "Usage Increment",
      description: "The minimum increment for usage amount. As an example, if usage increment is 1 Hour job execution time, then 1 Hour and 5 Minutes execution time may be calculated as 1 Hour or 2 Hours, depending on the rounding algorithm field of the dimension.",
    },
    rounding: {
      type: "string",
      label: "Rounding",
      description: "The rounding algorithm that is used to calculate the amount of usage increment. Ceiling algorithm rounds up, floor algorithm rounds down, the round algrogrithm rounds to the nearest whole integer rounding half away from zero.",
      options: constants.USAGE_ROUNDING,
    },
    usageEntitlement: {
      type: "string",
      label: "Usage Entitlement",
      description: "Used with Subscription Tier Offering type. SaaS customers subscribed to a subscription tier are entitled to use the amount of product with regard to the dimension up to the value specified in this field. For example, a subscription tier may entitle subscribers to make up to 1,000,000 API requests.",
      default: "inf",
      optional: true,
    },
    overageAllowed: {
      type: "string",
      label: "Overage Allowed",
      description: "Used with Subscription Tier Offering type. When the usage entitlement is specified, this field decides if allowing SaaS customers to use more than entitled amount of the product dimension.",
      default: "true",
      optional: true,
      options: [
        "true",
        "false",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.paigo.createDimension({
      $,
      data: {
        dimensionName: this.dimensionName,
        consumptionUnit: {
          type: this.consumptionUnitType,
          unit: this.consumptionUnit,
        },
        usageIncrement: this.usageIncrement,
        rounding: this.rounding,
        usageEntitlement: this.usageEntitlement,
        overageAllowed: this.overageAllowed,
      },
    });
    $.export("$summary", `Successfully created dimension with ID: ${response.dimensionId}`);
    return response;
  },
};
