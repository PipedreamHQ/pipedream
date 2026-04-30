import asana from "../../asana.app.mjs";

export default {
  key: "asana-list-teams",
  name: "List Teams",
  description: "Retrieves all teams in a specified Asana workspace. Use this action to discover available teams for creating projects, adding team members, or organizing work by department. Requires a workspace GID, which you can obtain from the **List Workspaces** action. The authenticated user must have access to the workspace; only teams visible to the user are returned. Results are paginated (default 25, max 100 per page); use the returned offset token to fetch additional pages. To include optional fields like description, visibility, or access levels, specify them in Opt Fields. Consider following up with **Create Project** to create a project under a team, or **List Users** to find team members. [See the documentation](https://developers.asana.com/reference/getteamsforworkspace)",
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
      type: "string[]",
      label: "Opt Fields",
      description: "This endpoint returns a resource which excludes some properties by default. To include those optional properties, set this query parameter to a list of the properties you wish to include (e.g. `[\"name\", \"description\", \"organization\"]`).",
      optional: true,
      options: [
        "resource_type",
        "name",
        "description",
        "html_description",
        "organization",
        "permalink_url",
        "visibility",
        "edit_team_name_or_description_access_level",
        "edit_team_visibility_or_trash_team_access_level",
        "member_invite_management_access_level",
        "guest_invite_management_access_level",
        "join_request_management_access_level",
        "team_member_removal_access_level",
        "team_content_management_access_level",
        "endorsed",
        "custom_field_settings",
      ],
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "The number of teams to return per page. Defaults to 25. Maximum is 100.",
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
    const response = await this.asana.getTeamsForWorkspace({
      $,
      workspace: this.workspace,
      params: {
        opt_fields: Array.isArray(this.optFields) && this.optFields.length
          ? this.optFields.join(",")
          : undefined,
        limit: this.limit,
        offset: this.offset?.trim() || undefined,
      },
    });
    $.export("$summary", `Successfully fetched ${response.data?.length} teams`);
    return response;
  },
};
