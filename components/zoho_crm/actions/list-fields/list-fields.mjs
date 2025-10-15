import zohoCrm from "../../zoho_crm.app.mjs";

export default {
  key: "zoho_crm-list-fields",
  name: "List Fields",
  description: "Gets the field metadata for the specified module",
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
  },
  async run({ $ }) {
    const response = await this.zohoCrm.listFields(this.module, $);
    $.export("$summary", "Successfully fetched fields for module");
    return response;
  },
};
