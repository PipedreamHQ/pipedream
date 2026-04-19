import workday from "../../workday.app.mjs";

export default {
  key: "workday-get-supervisory-org-details",
  name: "Get Supervisory Organization Details",
  description: "Get details for a supervisory organization.[See documentation](https://community.workday.com/sites/default/files/file-hosting/restapi/#staffing/v7/get-/supervisoryOrganizations/-ID-)",
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
    const response = await this.workday.getSupervisoryOrganization({
      id: this.supervisoryOrganizationId,
      $,
    });
    $.export("$summary", `Fetched supervisory organization ${this.supervisoryOrganizationId}`);
    return response;
  },
};
