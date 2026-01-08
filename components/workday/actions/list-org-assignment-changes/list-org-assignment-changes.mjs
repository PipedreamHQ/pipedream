import workday from "../../workday.app.mjs";

export default {
  key: "workday-list-org-assignment-changes",
  name: "List Organization Assignment Changes",
  description: "List all organization assignment changes.[See documentation](https://community.workday.com/sites/default/files/file-hosting/restapi/#staffing/v7/post-/organizationAssignmentChanges)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    workday,
  },

  async run({ $ }) {
    const response = await this.workday.listOrganizationAssignmentChanges({
      $,
    });
    $.export("$summary", `Fetched ${response?.data?.length || 0} organization assignment changes`);
    return response;
  },
};
