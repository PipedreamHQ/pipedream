import zohoCrm from "../../zoho_crm.app.mjs";

export default {
  key: "zoho_crm-list-modules",
  name: "List Modules",
  description: "Retrieves a list of all the modules available in your CRM account.",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    zohoCrm,
  },
  async run({ $ }) {
    const response = await this.zohoCrm.listModules();
    $.export("$summary", "Successfully listed modules");
    return response;
  },
};
