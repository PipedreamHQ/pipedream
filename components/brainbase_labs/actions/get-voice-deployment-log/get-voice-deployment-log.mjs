import app from "../../brainbase_labs.app.mjs";

export default {
  key: "brainbase-get-voice-deployment-log",
  name: "Get Voice Deployment Log",
  description: "Retrieve a single voice deployment log record. [See the documentation](https://docs.usebrainbase.com)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: false,
    readOnlyHint: true,
  },
  props: {
    app,
    workerId: {
      propDefinition: [
        app,
        "workerId",
      ],
    },
    logId: {
      type: "string",
      label: "Log ID",
      description: "The unique identifier for the log entry",
    },
  },
  async run({ $ }) {
    const response = await this.app.getVoiceDeploymentLog({
      $,
      workerId: this.workerId,
      logId: this.logId,
    });

    $.export("$summary", `Successfully retrieved log with ID ${this.logId}`);
    return response;
  },
};

