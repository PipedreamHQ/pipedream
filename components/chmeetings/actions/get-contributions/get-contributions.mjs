import app from "../../chmeetings.app.mjs";

export default {
  key: "chmeetings-get-contributions",
  name: "Get Contributions",
  description: "Get contributions from your ChMeetings account. [See the documentation](https://api.chmeetings.com/scalar/?_gl=1*xb9g3y*_gcl_au*MTI4MjM0MTM4Mi4xNzUzNzIxOTQw#tag/contributions/get/apiv1contributions)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
  },
  async run({ $ }) {
    const response = await this.app.getContributions({
      $,
    });
    $.export("$summary", `Successfully retrieved ${response.data.length} contributions`);
    return response;
  },
};
