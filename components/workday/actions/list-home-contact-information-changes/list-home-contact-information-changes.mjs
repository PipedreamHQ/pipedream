import workday from "../../workday.app.mjs";

export default {
  key: "workday-list-home-contact-information-changes",
  name: "List Home Contact Information Changes",
  description: "List all home contact information changes. [See the documentation]( https://community.workday.com/sites/default/files/file-hosting/restapi/#person/v4/homeContactInformationChanges)",
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
    const response = await this.workday.listHomeContactInformationChanges({
      $,
    });
    $.export("$summary", `Fetched ${response?.data?.length || 0} home contact change events`);
    return response;
  },
};
