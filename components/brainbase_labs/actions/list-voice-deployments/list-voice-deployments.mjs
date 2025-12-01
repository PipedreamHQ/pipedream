import app from "../../brainbase_labs.app.mjs";

export default {
  key: "brainbase_labs-list-voice-deployments",
  name: "List Voice Deployments",
  description:
    "Get all voice deployments for a worker. [See the documentation](https://docs.usebrainbase.com/api-reference/voice-deployments/get-all-voice-deployments-for-a-worker)",
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
  },
  async run({ $ }) {
    const response = await this.app.listVoiceDeployments({
      $,
      workerId: this.workerId,
    });

    $.export(
      "$summary",
      `Successfully retrieved ${response.data?.length || 0} voice deployment(s)`,
    );
    return response;
  },
};
