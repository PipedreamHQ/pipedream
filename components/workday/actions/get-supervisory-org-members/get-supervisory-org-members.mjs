import workday from "../../workday.app.mjs";

export default {
  key: "workday-get-supervisory-org-members",
  name: "Get Supervisory Organization Members",
  description: "Get members of a supervisory organization.[See documentation](https://community.workday.com/sites/default/files/file-hosting/restapi/#staffing/v7/get-/supervisoryOrganizations/-ID-/members)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    workday,
    supervisoryOrganizationId: {
      propDefinition: [
        workday,
        "supervisoryOrganizationId",
      ],
    },
  },

  async run({ $ }) {
    const response = await this.workday.getSupervisoryOrganizationMembers({
      id: this.supervisoryOrganizationId,
      $,
    });
    $.export("$summary", `Fetched members in supervisory organization ${this.supervisoryOrganizationId}`);
    return response;
  },
};
