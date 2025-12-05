import workday from "../../workday.app.mjs";

export default {
  key: "workday-get-org-assignment-change-details",
  name: "Get Organization Assignment Change Details",
  description: "Get details for an organization assignment change.[See documentation](https://community.workday.com/sites/default/files/file-hosting/restapi/#staffing/v7/get-/organizationAssignmentChanges/-ID-)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    workday,
    organizationAssignmentChangeId: {
      propDefinition: [
        workday,
        "organizationAssignmentChangeId",
      ],
    },
  },

  async run({ $ }) {
    const response = await this.workday.getOrganizationAssignmentChange({
      id: this.organizationAssignmentChangeId,
      $,
    });
    $.export("$summary", `Fetched organization assignment change ${this.organizationAssignmentChangeId}`);
    return response;
  },
};
