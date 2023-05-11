import zohoCrm from "../../zoho_crm.app.mjs";

export default {
  key: "zoho_crm-update-object",
  name: "Update Object",
  description: "Updates existing entities in the module.",
  version: "0.3.0",
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
    object: {
      type: "object",
      label: "Object",
      description: "The record object with fields to update.",
    },
  },
  async run({ $ }) {
    const response = await this.zohoCrm.updateObject(
      this.module,
      this.recordId,
      this.object,
      $,
    );
    $.export("$summary", "Successfully updated object");
    return response;
  },
};
