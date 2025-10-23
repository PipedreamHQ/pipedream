import workday from "../../workday.app.mjs";

export default {
  key: "workday-get-home-contact-information-change",
  name: "Get Home Contact Information Change",
  description: "Get a specific home contact information change by ID. [See documentation](https://community.workday.com/sites/default/files/file-hosting/restapi/#person/v4/homeContactInformationChanges-get)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    workday,
    homeContactInformationChangeId: {
      propDefinition: [
        workday,
        "homeContactInformationChangeId",
      ],
    },
  }
  ,
  async run({ $ }) {
    const response = await this.workday.getHomeContactInformationChange({
      homeContactInformationChangeId: this.homeContactInformationChangeId,
      $,
    });
    $.export("$summary", `Successfully fetched home contact information change with ID ${this.id}`);
    return response;
  },
};
