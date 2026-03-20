import workday from "../../workday.app.mjs";
export default {
  key: "workday-get-interview-details",
  name: "Get Interview Details",
  description: "Get details for a specific interview. [See documentation](https://community.workday.com/sites/default/files/file-hosting/restapi/#recruiting/v4/get-/interviews/-ID-)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    workday,
    interviewId: {
      propDefinition: [
        workday,
        "interviewId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.workday.getInterview({
      id: this.interviewId,
      $,
    });
    $.export("$summary", `Fetched details for interview ID ${this.interviewId}`);
    return response;
  },
};
