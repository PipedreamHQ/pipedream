import workday from "../../workday.app.mjs";

export default {
  key: "workday-get-pay-group",
  name: "Get Pay Group",
  description: "Get pay group by ID. [See the Documentation](https://community.workday.com/sites/default/files/file-hosting/restapi/#payroll/v2/get-/payGroups/-ID-)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    workday,
    payGroupId: {
      propDefinition: [
        workday,
        "payGroupId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.workday.getPayGroup({
      id: this.payGroupId,
      $,
    });
    $.export("$summary", `Fetched pay group for ID ${this.payGroupId}`);
    return response;
  },
};
