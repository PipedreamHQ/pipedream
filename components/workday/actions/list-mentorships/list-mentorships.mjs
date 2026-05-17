import workday from "../../workday.app.mjs";

export default {
  key: "workday-list-mentorships",
  name: "List Mentorships",
  description: "List all mentorships. [See the Documentation](https://community.workday.com/sites/default/files/file-hosting/restapi/#talentManagement/v2/get-/mentorships)",
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
    const response = await this.workday.listMentorships({
      $,
    });
    $.export("$summary", `Fetched ${response?.data?.length || 0} mentorships`);
    return response;
  },
};
