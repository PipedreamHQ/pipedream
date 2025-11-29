import workday from "../../workday.app.mjs";
export default {
  key: "workday-get-work-contact-information-change",
  name: "Get Work Contact Information Change",
  description: "Get specific work contact information change by ID. [See documentation](https://community.workday.com/sites/default/files/file-hosting/restapi/#person/v4/get-/workContactInformationChanges/-ID-)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    workday,
    workContactInformationChangeId: {
      type: "string",
      label: "Work Contact Information Change ID",
      description: "The ID of the work contact information change.",
    },
  },
  async run({ $ }) {
    const response = await this.workday.getWorkContactInformationChange({
      id: this.workContactInformationChangeId,
      $,
    });
    $.export("$summary", `Fetched change ${this.workContactInformationChangeId}`);
    return response;
  },
};
