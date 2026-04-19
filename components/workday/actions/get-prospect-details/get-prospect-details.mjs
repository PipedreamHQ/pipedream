import workday from "../../workday.app.mjs";
export default {
  key: "workday-get-prospect-details",
  name: "Get Prospect Details",
  description: "Get details for a specific prospect by ID. [See documentation](https://community.workday.com/sites/default/files/file-hosting/restapi/#recruiting/v4/get-/prospects/-ID-)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    workday,
    prospectId: {
      propDefinition: [
        workday,
        "prospectId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.workday.getProspect({
      id: this.prospectId,
      $,
    });
    $.export("$summary", `Fetched details for prospect ID ${this.prospectId}`);
    return response;
  },
};
