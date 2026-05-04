import asana from "../../asana.app.mjs";

export default {
  key: "asana-list-users",
  name: "List Users",
  description: "Retrieves all users in a specified Asana workspace. Use this action to populate assignee choices for tasks, verify workspace membership, or audit user access. Requires a workspace GID, which you can obtain from the **List Workspaces** action. The authenticated user must have access to the workspace. Results are paginated; use the returned offset token to fetch additional pages. To include optional fields like email or photo, specify them in Opt Fields. Consider following up with **Create Task** or **Update Task** to assign work to the retrieved users. [See the documentation](https://developers.asana.com/reference/getusersforworkspace)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    asana,
    workspace: {
      propDefinition: [
        asana,
        "workspaces",
      ],
      type: "string",
      label: "Workspace",
      description: "The workspace to list users for. This field uses the workspace GID (e.g., \"1234567890123456\").",
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
    $.export("$summary", `Successfully fetched ${response.data?.length} users`);
    return response;
  },
};
