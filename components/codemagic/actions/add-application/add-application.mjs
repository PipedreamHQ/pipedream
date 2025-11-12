import app from "../../codemagic.app.mjs";

export default {
  key: "codemagic-add-application",
  name: "Create Application",
  description: "Creates a new application codemagic. [See the documentation](https://docs.codemagic.io/rest-api/applications/#add-a-new-application)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    repositoryUrl: {
      propDefinition: [
        app,
        "repositoryUrl",
      ],
    },
    teamId: {
      propDefinition: [
        app,
        "teamId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.addApp({
      $,
      data: {
        repositoryUrl: this.repositoryUrl,
        teamId: this.teamId,
      },
    });

    $.export("$summary", `Successfully created application '${response.appName}'`);

    return response;
  },
};
