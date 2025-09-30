import zohoCrm from "../../zoho_crm.app.mjs";

export default {
  key: "zoho_crm-search-objects",
  name: "Search Objects",
  description: "Retrieves the records that match your search criteria.",
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
    criteria: {
      type: "string",
      label: "Criteria",
      description: "Performs search by this criteria.",
    },
  },
  async run({ $ }) {
    const response = await this.zohoCrm.searchObjects(this.module, this.criteria, $);
    $.export("$summary", "Search done");
    return response;
  },
};
