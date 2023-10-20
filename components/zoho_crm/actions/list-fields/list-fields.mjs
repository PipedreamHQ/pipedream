import zohoCrm from "../../zoho_crm.app.mjs";

export default {
  key: "zoho_crm-list-fields",
  name: "List Fields",
  description: "Gets the field metadata for the specified module",
  version: "0.2.1",
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
