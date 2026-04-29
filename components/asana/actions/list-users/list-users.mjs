import asana from "../../asana.app.mjs";

export default {
  key: "asana-list-users",
  name: "List Users",
  description: "List users in a workspace. [See the documentation](https://developers.asana.com/reference/getusersforworkspace)",
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
      description: "The workspace to list users for. This field uses the workspace GID.",
    },
    optFields: {
      type: "string",
      label: "Opt Fields",
      description: "This endpoint returns a resource which excludes some properties by default. To include those optional properties, set this query parameter to a comma-separated list of the properties you wish to include.",
      optional: true,
    },
    offset: {
      type: "string",
      label: "Offset",
      description: "Offset token. An offset to the next page returned by the API. A pagination request will return an offset token, which can be used as an input parameter to the next request. If an offset is not passed in, the API will return the first page of results. Note: You can only pass in an offset that was returned to you via a previously paginated request.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.asana.getUsers({
      $,
      workspace: this.workspace,
      params: {
        opt_fields: this.optFields,
        offset: this.offset,
      },
    });
    $.export("$summary", `Successfully fetched ${response.data?.length} users`);
    return response;
  },
};
