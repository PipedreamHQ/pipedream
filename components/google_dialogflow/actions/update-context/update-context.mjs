import googleDialogflow from "../../google_dialogflow.app.mjs";

export default {
  type: "action",
  key: "google_dialogflow-update-context",
  version: "1.0.1",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  name: "Update Context",
  description: "Updates a context, [See REST docs](https://cloud.google.com/dialogflow/es/docs/reference/rest/v2/projects.agent.sessions.contexts/patch) and [client API](https://googleapis.dev/nodejs/dialogflow/latest/google.cloud.dialogflow.v2beta1.Contexts.html#updateContext2)",
  props: {
    googleDialogflow,
    sessionId: {
      propDefinition: [
        googleDialogflow,
        "sessionId",
      ],
    },
    name: {
      propDefinition: [
        googleDialogflow,
        "name",
      ],
      description: "Context name(Not path)",
    },
    lifespanCount: {
      propDefinition: [
        googleDialogflow,
        "lifespanCount",
      ],
    },
    parameters: {
      propDefinition: [
        googleDialogflow,
        "parameters",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.googleDialogflow.updateContext({
      name: this.name,
      lifespanCount: this.lifespanCount,
      parameters: this.parameters,
      sessionId: this.sessionId,
    });
    $.export("$summary", "Context has been updated.");
    return response[0];
  },
};
