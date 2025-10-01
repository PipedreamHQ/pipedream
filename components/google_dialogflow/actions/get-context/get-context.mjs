import googleDialogflow from "../../google_dialogflow.app.mjs";

export default {
  type: "action",
  key: "google_dialogflow-get-context",
  version: "1.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  name: "Get Context",
  description: "Get a context, [See REST docs](https://cloud.google.com/dialogflow/es/docs/reference/rest/v2/projects.agent.sessions.contexts/get) and [client API](https://googleapis.dev/nodejs/dialogflow/latest/google.cloud.dialogflow.v2beta1.Contexts.html#getContext2)",
  props: {
    googleDialogflow,
    name: {
      propDefinition: [
        googleDialogflow,
        "name",
      ],
      description: "Context name(Context path)",
    },
  },
  async run({ $ }) {
    const response = await this.googleDialogflow.getContext({
      name: this.name,
    });
    $.export("$summary", "Context has been retrieved.");
    return response[0];
  },
};
