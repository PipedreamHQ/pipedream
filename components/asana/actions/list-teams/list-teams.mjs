import asana from "../../asana.app.mjs";

export default {
  key: "asana-list-teams",
  name: "List Teams",
  description: "Retrieves all teams in a specified Asana workspace. Use this action to discover available team GIDs for creating projects or organizing work by department. Requires a workspace GID from **List Workspaces**. Results are paginated (default 25 per page); pass the returned `next_offset` as `offset` to fetch additional pages. Consider following up with **Create Project** to create a project under a team. Example: call with `workspace: '1200123456789012'` → returns `{data: [{gid: '1203456789012345', name: 'Design'}, ...], next_offset: null}`. [See the documentation](https://developers.asana.com/reference/getteamsforworkspace)",
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
      description: "The workspace to list teams for (a real workspace GID, not the example value below). Use **List Workspaces** to find valid GIDs — do not guess or reuse the example shown here. Format example: \"120111222333444\".",
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
    const truncated = !!response.next_page?.offset;
    $.export("$summary", `Successfully fetched ${response.data?.length} teams${
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
