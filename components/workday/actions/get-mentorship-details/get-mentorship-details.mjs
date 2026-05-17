import workday from "../../workday.app.mjs";

export default {
  key: "workday-get-mentorship-details",
  name: "Get Mentorship Details",
  description: "Get details of a mentorship by ID. [See the Documentation](https://community.workday.com/sites/default/files/file-hosting/restapi/#talentManagement/v2/get-/mentorships/-ID-)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    workday,
    mentorshipId: {
      propDefinition: [
        workday,
        "mentorshipId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.workday.getMentorship({
      id: this.mentorshipId,
      $,
    });
    $.export("$summary", `Fetched details for mentorship ID ${this.mentorshipId}`);
    return response;
  },
};
