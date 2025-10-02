import zohoCrm from "../../zoho_crm.app.mjs";

export default {
  key: "zoho_crm-list-objects",
  name: "List Objects",
  description: "Gets the list of available records from a module.",
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
    fields: {
      type: "string",
      label: "Fields",
      description: "To retrieve specific field values. Comma separated field API names.",
      optional: true,
    },
    ids: {
      type: "string",
      label: "IDs",
      description: "To retrieve specific records based on their unique ID.",
      optional: true,
    },
    sortOrder: {
      type: "string",
      label: "Sort Order",
      description: "To sort the list of records in either ascending or descending order.",
      optional: true,
      options: [
        "asc",
        "desc",
      ],
    },
    sortBy: {
      type: "string",
      label: "Sort By",
      description: "Specify the API name of the field based on which the records must be sorted.",
      optional: true,
    },
    converted: {
      type: "string",
      label: "Converted",
      description: "To retrieve the list of converted records.",
      optional: true,
      options: [
        "false",
        "true",
        "both",
      ],
    },
    approved: {
      type: "string",
      label: "Approved",
      description: "To retrieve the list of approved records.",
      optional: true,
      options: [
        "false",
        "true",
        "both",
      ],
    },
    page: {
      type: "string",
      label: "Page",
      description: "To get the list of records from the respective pages.",
      optional: true,
    },
    perPage: {
      type: "string",
      label: "Per Page",
      description: "To get the list of records available per page.",
      optional: true,
    },
    cvId: {
      type: "string",
      label: "Custom View ID",
      description: "To get the list of records in a custom view.",
      optional: true,
    },
    territoryId: {
      type: "string",
      label: "Territory ID",
      description: "To get the list of records in a territory.",
      optional: true,
    },
    includeChild: {
      type: "boolean",
      label: "Include Child",
      description: "To include records from the child territories",
      optional: true,
    },
  },
  async run({ $ }) {
    const params = {
      fields: this.fields,
      ids: this.ids,
      sort_order: this.sortOrder,
      sort_by: this.sortBy,
      converted: this.converted,
      approved: this.approved,
      page: this.page,
      per_page: this.perPage,
      cvid: this.cvId,
      territory_id: this.territoryId,
      include_child: this.includeChild,
    };
    const response = await this.zohoCrm.listRecords(this.module, this.page, params, $);
    $.export("$summary", "Successfully listed objects");
    return response;
  },
};
