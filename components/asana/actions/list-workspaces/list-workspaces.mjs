import asana from "../../asana.app.mjs";

export default {
  key: "asana-list-workspaces",
  name: "List Workspaces",
  description: "List workspaces available to the authenticated Asana account. Use this when you need a workspace GID before running **List Teams** or other workspace-scoped actions. `optFields` can include optional workspace properties such as `email_domains` and `is_organization`; leave `offset` empty for the first page and pass a returned offset token (for example, `3:0:abcdef123456`) to fetch the next page. [See the documentation](https://developers.asana.com/reference/getworkspaces)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    asana,
    optFields: {
      type: "string[]",
      label: "Opt Fields",
      description: "This action returns a resource which excludes some properties by default. To include those optional properties, set this prop to a list of the properties you wish to include (e.g. `[\"name\", \"email_domains\", \"is_organization\"]`).",
      optional: true,
      options: [
        "resource_type",
        "name",
        "email_domains",
        "is_organization",
      ],
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "The number of workspaces to return per page. Defaults to 25. Maximum is 100.",
      optional: true,
      default: 25,
      min: 1,
      max: 100,
    },
    offset: {
      type: "string",
      label: "Offset",
      description: "Offset token. An offset to the next page returned by the API. A pagination request will return an offset token, which can be used as an input parameter to the next request. If an offset is not passed in, the API will return the first page of results. Note: You can only pass in an offset that was returned to you via a previously paginated request (e.g. \"3:0:abcdef123456\").",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.asana.getWorkspaces({
      $,
      params: {
        opt_fields: Array.isArray(this.optFields) && this.optFields.length
          ? this.optFields.join(",")
          : undefined,
        limit: this.limit,
        offset: this.offset?.trim() || undefined,
      },
    });
    $.export("$summary", `Successfully fetched ${response.data?.length} workspaces`);
    return response;
  },
};
