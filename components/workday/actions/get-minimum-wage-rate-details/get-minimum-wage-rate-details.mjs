import workday from "../../workday.app.mjs";

export default {
  key: "workday-get-minimum-wage-rate-details",
  name: "Get Minimum Wage Rate Details",
  description: "Get details of a minimum wage rate by ID. [See the Documentation](https://community.workday.com/sites/default/files/file-hosting/restapi/#payroll/v2/get-/minimumWageRates/-ID-)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    workday,
    minimumWageRateId: {
      propDefinition: [
        workday,
        "minimumWageRateId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.workday.getMinimumWageRate({
      id: this.minimumWageRateId,
      $,
    });
    $.export("$summary", `Fetched details for minimum wage rate ID ${this.minimumWageRateId}`);
    return response;
  },
};
