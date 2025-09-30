import googleDialogflow from "../../google_dialogflow.app.mjs";

export default {
  type: "action",
  key: "google_dialogflow-get-intent",
  version: "1.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  name: "Get Intent",
  description: "Retrieves an intent [See REST docs](https://cloud.google.com/dialogflow/es/docs/reference/rest/v2/projects.agent.intents/get) and [client API][https://googleapis.dev/nodejs/dialogflow/latest/google.cloud.dialogflow.v2beta1.Intents.html#getIntent2]",
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
    const response = await this.googleDialogflow.getIntent({
      name: this.intent,
    });
    $.export("$summary", "Intent has been retrieved.");
    return response[0];
  },
};
