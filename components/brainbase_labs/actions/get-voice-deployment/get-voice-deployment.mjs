import app from "../../brainbase_labs.app.mjs";

export default {
  key: "brainbase-get-voice-deployment",
  name: "Get Voice Deployment",
  description: "Get a single voice deployment by ID. [See the documentation](https://docs.usebrainbase.com)",
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
    deploymentId: {
      propDefinition: [
        app,
        "deploymentId",
        (c) => ({
          workerId: c.workerId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.getVoiceDeployment({
      $,
      workerId: this.workerId,
      deploymentId: this.deploymentId,
    });

    $.export("$summary", `Successfully retrieved voice deployment with ID ${this.deploymentId}`);
    return response;
  },
};

