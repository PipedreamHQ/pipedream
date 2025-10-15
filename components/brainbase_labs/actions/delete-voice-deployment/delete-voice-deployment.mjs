import app from "../../brainbase_labs.app.mjs";

export default {
  key: "brainbase-delete-voice-deployment",
  name: "Delete Voice Deployment",
  description: "Delete a voice deployment. [See the documentation](https://docs.usebrainbase.com)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
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
    const response = await this.app.deleteVoiceDeployment({
      $,
      workerId: this.workerId,
      deploymentId: this.deploymentId,
    });

    $.export("$summary", `Successfully deleted voice deployment with ID ${this.deploymentId}`);
    return response;
  },
};

