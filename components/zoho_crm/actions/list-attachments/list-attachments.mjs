import zohoCrm from "../../zoho_crm.app.mjs";

export default {
  key: "zoho_crm-list-attachments",
  name: "List Attachments",
  description: "Gets the list of attachments for a record in Zoho CRM. Use **List Modules** to find the `module` API name and **List Objects** to find the `recordId`. Results are paginated 200 per page (`page` is 0-indexed). [See the documentation](https://www.zoho.com/crm/developer/docs/api/v8/get-attachments.html)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
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
    page: {
      type: "integer",
      label: "Page",
      description: "The page number of the results to return. The first page is 0.",
      min: 0,
      default: 0,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.zohoCrm.listAttachments(this.module, this.recordId, this.page, $);
    const count = response?.data?.length || 0;
    $.export("$summary", `Found ${count} attachment${count === 1
      ? ""
      : "s"}`);
    return response;
  },
};
