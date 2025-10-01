import app from "../../parsehub.app.mjs";

export default {
  key: "parsehub-run-project",
  name: "Run Parsehub Project",
  description: "Initiates an instance of a specified project on the Parsehub cloud. [See the documentation](https://www.parsehub.com/docs/ref/api/v2/#run-a-project)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    startUrl: {
      propDefinition: [
        app,
        "startUrl",
      ],
    },
    projectId: {
      propDefinition: [
        app,
        "projectId",
      ],
    },
    sendEmail: {
      type: "boolean",
      label: "Send Email",
      description: "Whether Parsehub should send an email when the run finishes",
    },
  },
  async run({ $ }) {
    const response = await this.app.runProject({
      $,
      projectId: this.projectId,
      data: {
        sendEmail: this.sendEmail,
        start_url: this.startUrl,
      },
    });

    $.export("$summary", `Successfully initiated project run for project ID: ${this.projectId}`);

    return response;
  },
};
