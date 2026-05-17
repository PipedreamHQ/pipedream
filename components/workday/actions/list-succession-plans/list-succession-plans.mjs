import workday from "../../workday.app.mjs";

export default {
  key: "workday-list-succession-plans",
  name: "List Succession Plans",
  description: "List all succession plans. [See the Documentation](https://community.workday.com/sites/default/files/file-hosting/restapi/#talentManagement/v2/get-/successionPlans)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    workday,
  },
  async run({ $ }) {
    const response = await this.workday.listSuccessionPlans({
      $,
    });
    $.export("$summary", `Fetched ${response?.data?.length || 0} succession plans`);
    return response;
  },
};
