import workday from "../../workday.app.mjs";

export default {
  key: "workday-get-succession-plan-details",
  name: "Get Succession Plan Details",
  description: "Get details of a succession plan by ID. [See the Documentation](https://community.workday.com/sites/default/files/file-hosting/restapi/#talentManagement/v2/get-/successionPlans/-ID-)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    workday,
    successionPlanId: {
      propDefinition: [
        workday,
        "successionPlanId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.workday.getSuccessionPlan({
      id: this.successionPlanId,
      $,
    });
    $.export("$summary", `Fetched details for succession plan ID ${this.successionPlanId}`);
    return response;
  },
};
