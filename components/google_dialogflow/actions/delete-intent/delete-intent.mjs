import googleDialogflow from "../../google_dialogflow.app.mjs";

export default {
  type: "action",
  key: "google_dialogflow-delete-intent",
  version: "1.0.1",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  name: "Delete Intent",
  description: "Deletes an intent, [See REST docs](https://cloud.google.com/dialogflow/es/docs/reference/rest/v2/projects.agent.intents/delete) and [client API](https://googleapis.dev/nodejs/dialogflow/latest/google.cloud.dialogflow.v2beta1.Intents.html#deleteIntent2)",
  props: {
    googleDialogflow,
    intent: {
      propDefinition: [
        googleDialogflow,
        "intent",
      ],
    },
  },
  async run({ $ }) {
    await this.googleDialogflow.deleteIntent({
      name: this.intent,
    });
    $.export("$summary", "Intent has been deleted.");
  },
};
