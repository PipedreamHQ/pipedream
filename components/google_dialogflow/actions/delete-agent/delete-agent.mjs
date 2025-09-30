import googleDialogflow from "../../google_dialogflow.app.mjs";

export default {
  type: "action",
  key: "google_dialogflow-delete-agent",
  version: "1.0.1",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  name: "Delete Agent",
  description: "Deletes an agent, [See REST docs](https://cloud.google.com/dialogflow/es/docs/reference/rest/v2/projects/deleteAgent) and [client API](https://googleapis.dev/nodejs/dialogflow/latest/google.cloud.dialogflow.v2.Agents.html#deleteAgent2)",
  props: {
    googleDialogflow,
  },
  async run({ $ }) {
    const response = await this.googleDialogflow.deleteAgent();
    $.export("$summary", "Agent has been deleted.");
    return response[0];
  },
};
