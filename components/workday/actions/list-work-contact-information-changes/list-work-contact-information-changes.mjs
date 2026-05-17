import workday from "../../workday.app.mjs";
export default {
  key: "workday-list-work-contact-information-changes",
  name: "List Work Contact Information Changes",
  description: "List all work contact information changes. [See documentation](https://community.workday.com/sites/default/files/file-hosting/restapi/#person/v4/workContactInformationChanges)",
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
    const response = await this.workday.listWorkContactInformationChanges({
      $,
    });
    $.export("$summary", `Found ${response?.data?.length || 0} changes`);
    return response;
  },
};
