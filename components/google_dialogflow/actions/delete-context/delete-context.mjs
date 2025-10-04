import googleDialogflow from "../../google_dialogflow.app.mjs";

export default {
  type: "action",
  key: "google_dialogflow-delete-context",
  version: "1.0.1",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  name: "Delete Context",
  description: "Deletes a context [See REST docs](https://cloud.google.com/dialogflow/es/docs/reference/rest/v2/projects.agent.environments.users.sessions.contexts/delete) and [client API](https://googleapis.dev/nodejs/dialogflow/latest/google.cloud.dialogflow.v2beta1.Contexts.html#deleteContext2)",
  props: {
    googleDialogflow,
    name: {
      propDefinition: [
        googleDialogflow,
        "name",
      ],
      description: "Context name(context path)",
    },
  },
  async run({ $ }) {
    await this.googleDialogflow.deleteContext({
      name: this.name,
    });
    $.export("$summary", "Context has been deleted.");
  },
};
