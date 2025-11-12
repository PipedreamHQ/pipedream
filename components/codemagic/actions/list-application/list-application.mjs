import app from "../../codemagic.app.mjs";

export default {
  key: "codemagic-list-application",
  name: "List Applications",
  description: "List applications in codemagic. [See the documentation](https://docs.codemagic.io/rest-api/applications/#retrieve-all-applications)",
  version: "0.0.3",
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
    const response = await this.app.listApps({
      $,
    });

    $.export("$summary", `Successfully retrieved ${response.applications.length} application(s)`);

    return response;
  },
};
