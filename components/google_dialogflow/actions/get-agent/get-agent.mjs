import googleDialogflow from "../../google_dialogflow.app.mjs";

export default {
  type: "action",
  key: "google_dialogflow-get-agent",
  version: "1.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  name: "Get Agent",
  description: "Retrieves an agent, [See REST docs](https://cloud.google.com/dialogflow/es/docs/reference/rest/v2/projects/getAgent) and [client API](https://googleapis.dev/nodejs/dialogflow/latest/google.cloud.dialogflow.v2.Agents.html#getAgent2)",
  props: {
    googleDialogflow,
  },
  async run({ $ }) {
    const response = await this.googleDialogflow.getAgent();
    $.export("$summary", "Agent has been retrieved.");
    return response[0];
  },
};
