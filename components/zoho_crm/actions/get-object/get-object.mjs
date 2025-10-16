import zohoCrm from "../../zoho_crm.app.mjs";

export default {
  key: "zoho_crm-get-object",
  name: "Get Object",
  description: "Gets record data given its id.",
  version: "0.2.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    zohoCrm,
    module: {
      propDefinition: [
        zohoCrm,
        "module",
      ],
    },
    recordId: {
      propDefinition: [
        zohoCrm,
        "recordId",
        (c) => ({
          module: c.module,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.zohoCrm.getObject(this.module, this.recordId, $);
    $.export("$summary", "Successfully retrieved object");
    return response;
  },
};
