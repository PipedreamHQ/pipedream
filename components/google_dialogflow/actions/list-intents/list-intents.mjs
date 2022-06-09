import googleDialogflow from "../../google_dialogflow.app.mjs";

export default {
  type: "action",
  key: "google_dialogflow-list-intents",
  version: "0.0.1",
  name: "List Intents",
  description: "Retrieves the list of the intents, [See REST docs](https://cloud.google.com/dialogflow/es/docs/reference/rest/v2beta1/projects.agent.intents/list) and [client API](https://googleapis.dev/nodejs/dialogflow/latest/google.cloud.dialogflow.v2beta1.Intents.html#listIntents2)",
  props: {
    googleDialogflow,
  },
  async run({ $ }) {
    const response = await this.googleDialogflow.listIntents();
    $.export("$summary", "Intent list has been retreived.");
    return response[0];
  },
};
