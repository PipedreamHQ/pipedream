import googleDialogflow from "../../google_dialogflow.app.mjs";

export default {
  type: "action",
  key: "google_dialogflow-list-contexts",
  version: "1.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  name: "List Contexts",
  description: "Retrieves the list of the contexts with the given session ID, [See REST docs](https://cloud.google.com/dialogflow/es/docs/reference/rest/v2/projects.agent.sessions.contexts/list) and [client API](https://googleapis.dev/nodejs/dialogflow/latest/google.cloud.dialogflow.v2beta1.Contexts.html#listContexts2)",
  props: {
    googleDialogflow,
    sessionId: {
      propDefinition: [
        googleDialogflow,
        "sessionId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.googleDialogflow.listContexts({
      sessionId: this.sessionId,
    });
    $.export("$summary", "Context list has been retrieved.");
    return response[0];
  },
};
