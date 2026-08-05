// x-pd-ai: optimized
import clockify from "../../clockify.app.mjs";

export default {
  key: "clockify-list-invoices",
  name: "List Invoices",
  description: "List all invoices in a Clockify workspace. Use the page and page size inputs to page through results. [See the documentation](https://docs.clockify.me/#tag/Invoice/operation/getInvoices)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    clockify,
    workspaceId: {
      propDefinition: [
        clockify,
        "workspaceId",
      ],
    },
    page: {
      propDefinition: [
        clockify,
        "page",
      ],
    },
    pageSize: {
      propDefinition: [
        clockify,
        "pageSize",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.clockify.listInvoices({
      $,
      workspaceId: this.workspaceId,
      params: {
        "page": this.page,
        "page-size": this.pageSize,
      },
    });

    $.export("$summary", `Successfully listed ${response.invoices.length} invoices in the workspace`);

    return response;
  },
};
