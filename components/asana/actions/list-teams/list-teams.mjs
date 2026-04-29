import asana from "../../asana.app.mjs";

export default {
  key: "asana-list-teams",
  name: "List Teams",
  description: "List teams in a workspace. [See the documentation](https://developers.asana.com/reference/getteamsforworkspace)",
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
      description: "The workspace to list teams for. This field uses the workspace GID (e.g. \"120111222333444\").",
    },
    optFields: {
      type: "string",
      label: "Opt Fields",
      description: "This endpoint returns a resource which excludes some properties by default. To include those optional properties, set this query parameter to a comma-separated list of the properties you wish to include (e.g. \"members,description,projects\").",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "The number of teams to return per page. Defaults to 25. Maximum is 100.",
      optional: true,
      default: 25,
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
    const response = await this.asana.getTeamsForWorkspace({
      $,
      workspace: this.workspace,
      params: {
        opt_fields: this.optFields,
        limit: this.limit,
        offset: this.offset,
      },
    });
    $.export("$summary", `Successfully fetched ${response.data?.length} teams`);
    return response;
  },
};
