import surecart from "../../surecart.app.mjs";

export default {
  key: "surecart-list-customers",
  name: "List Customers",
  description: "Return a list of customers. [See the documentation](https://developer.surecart.com/api-reference/customers/list)",
  version: "0.0.2",
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
      propDefinition: [
        surecart,
        "ids",
      ],
    },
    licenseIds: {
      type: "string[]",
      label: "License IDs",
      description: "Filter by license IDs. Example: `[\"lic_abc123\"]`",
      optional: true,
    },
    limit: {
      propDefinition: [
        surecart,
        "limit",
      ],
    },
    liveMode: {
      propDefinition: [
        surecart,
        "liveMode",
      ],
    },
    page: {
      propDefinition: [
        surecart,
        "page",
      ],
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
      description: "Sort results by the specified field. Example: `created_at`",
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
