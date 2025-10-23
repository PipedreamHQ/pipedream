import workday from "../../workday.app.mjs";

export default {
  key: "workday-get-pay-group-detail",
  name: "Get Pay Group Detail",
  description: "Get pay group detail by ID. [See the Documentation](https://community.workday.com/sites/default/files/file-hosting/restapi/#payroll/v2/get-/payGroupDetails/-ID-)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    workday,
    payGroupDetailId: {
      propDefinition: [
        workday,
        "payGroupDetailId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.workday.getPayGroupDetail({
      id: this.payGroupDetailId,
      $,
    });
    $.export("$summary", `Fetched pay group detail ID ${this.payGroupDetailId}`);
    return response;
  },
};
