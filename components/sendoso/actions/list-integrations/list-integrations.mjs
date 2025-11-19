import sendoso from "../../sendoso.app.mjs";

export default {
  key: "sendoso-list-integrations",
  name: "List Integrations",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  description: "Retrieve a list of available integrations. [See the documentation](https://sendoso.docs.apiary.io/#reference/integration-management)",
  type: "action",
  props: {
    sendoso,
    page: {
      type: "integer",
      label: "Page",
      description: "Page number to retrieve (1-based).",
      optional: true,
      default: 1,
      min: 1,
    },
    perPage: {
      type: "integer",
      label: "Per Page",
      description: "Number of integrations per page.",
      optional: true,
      default: 50,
      min: 1,
    },
  },
  async run({ $ }) {
    const params = {};
    if (this.page) params.page = this.page;
    if (this.perPage) params.per_page = this.perPage;

    const response = await this.sendoso.listIntegrations({
      $,
      params,
    });

    const count = Array.isArray(response) ?
      response.length :
      (response.data?.length || response.integrations?.length || 0);
    $.export("$summary", `Successfully retrieved ${count} integration(s)`);
    return response;
  },
};

