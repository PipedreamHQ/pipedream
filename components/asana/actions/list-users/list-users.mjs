import asana from "../../asana.app.mjs";

export default {
  key: "asana-list-users",
  name: "List Users",
  description: "Retrieves all users in a specified Asana workspace. Use this to get user GIDs for assignee or owner fields in **Create Task** or **Update Task**. Requires a workspace GID from **List Workspaces**. Results are paginated; pass the returned `next_offset` as `offset` to fetch additional pages. Example: call with `workspace: '1200123456789012'`, `optFields: ['name','email']` → returns `{data: [{gid: '1198765432109876', name: 'Jane Doe', email: 'jane@acme.com'}, ...]}`. [See the documentation](https://developers.asana.com/reference/getusersforworkspace)",
  version: "1.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  ai: "optimized",
  props: {
    asana,
    workspace: {
      propDefinition: [
        asana,
        "workspaces",
      ],
      type: "string",
      label: "Workspace",
      description: "The workspace to list users for (a real workspace GID, not the example value below, and not the string \"me\"). Use **List Workspaces** to find valid GIDs — do not guess or reuse the example shown here. Format example: \"1234567890123456\".",
    },
    optFields: {
      type: "string[]",
      label: "Opt Fields",
      description: "This endpoint returns a resource which excludes some properties by default. To include those optional properties, set this query parameter to a list of the properties you wish to include (e.g., `[\"name\", \"email\", \"photo\"]`).",
      optional: true,
      options: [
        "resource_type",
        "name",
        "email",
        "photo",
        "workspaces",
        "custom_fields",
      ],
    },
    offset: {
      type: "string",
      label: "Offset",
      description: "Offset token. An offset to the next page returned by the API. A pagination request will return an offset token, which can be used as an input parameter to the next request. If an offset is not passed in, the API will return the first page of results. Note: You can only pass in an offset that was returned to you via a previously paginated request (e.g., \"5f4d3a2b\").",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.asana.getUsers({
      $,
      params: {
        workspace: this.workspace,
        opt_fields: Array.isArray(this.optFields) && this.optFields.length
          ? this.optFields.join(",")
          : undefined,
        offset: this.offset?.trim() || undefined,
      },
    });
    const truncated = !!response.next_page?.offset;
    $.export("$summary", `Successfully fetched ${response.data?.length} users${
      truncated
        ? " (more pages available)"
        : ""
    }`);
    return {
      data: response.data,
      truncated,
      next_offset: response.next_page?.offset || null,
    };
  },
};
