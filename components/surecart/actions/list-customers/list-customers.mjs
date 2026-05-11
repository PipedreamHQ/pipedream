import surecart from "../../surecart.app.mjs";

export default {
  key: "surecart-list-customers",
  name: "List Customers",
  description: "Return a list of customers. [See the documentation](https://developer.surecart.com/api-reference/customers/list)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    surecart,
    email: {
      type: "string",
      label: "Email",
      description: "Filter customers by email address. Example: `customer@example.com`",
      optional: true,
    },
    ids: {
      type: "string[]",
      label: "IDs",
      description: "Filter by specific IDs. Example: `[\"id_abc123\", \"id_def456\"]`",
      optional: true,
    },
    licenseIds: {
      type: "string[]",
      label: "License IDs",
      description: "Filter by license IDs. Example: `[\"lic_abc123\"]`",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Number of results to return per page (1-100). Example: `25`",
      optional: true,
    },
    liveMode: {
      type: "boolean",
      label: "Live Mode",
      description: "Filter by live mode (`true`) or test mode (`false`).",
      optional: true,
    },
    page: {
      type: "integer",
      label: "Page",
      description: "Page number for pagination. Example: `1`",
      optional: true,
    },
    query: {
      type: "string",
      label: "Query",
      description: "Full-text search query to filter customers by name or email. Example: `Jane`",
      optional: true,
    },
    sort: {
      type: "string",
      label: "Sort",
      description: "Sort results by the specified field.",
      optional: true,
      options: [
        "created_at",
        "email",
        "name",
        "updated_at",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.surecart.listCustomers({
      $,
      params: {
        "email": this.email,
        "ids[]": this.ids,
        "license_ids[]": this.licenseIds,
        "limit": this.limit,
        "live_mode": this.liveMode,
        "page": this.page,
        "query": this.query,
        "sort": this.sort,
      },
    });
    $.export("$summary", `Successfully retrieved ${response.data?.length ?? 0} customer(s)`);
    return response;
  },
};
