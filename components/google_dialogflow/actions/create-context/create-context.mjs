import googleDialogflow from "../../google_dialogflow.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  type: "action",
  key: "google_dialogflow-create-context",
  version: "0.0.1",
  name: "Create Context",
  description: "Creates a context, [See REST docs](https://cloud.google.com/dialogflow/es/docs/reference/rest/v2/projects.agent.sessions.contexts/create) and [client API](https://googleapis.dev/nodejs/dialogflow/latest/google.cloud.dialogflow.v2beta1.Contexts.html#createContext2)",
  props: {
    googleDialogflow,
    name: {
      propDefinition: [
        googleDialogflow,
        "name",
      ],
      description: "Context name",
    },
    sessionId: {
      propDefinition: [
        googleDialogflow,
        "sessionId",
      ],
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
    const response = await this.googleDialogflow.createContext({
      name: this.name,
      lifespanCount: this.lifespanCount,
      parameters: utils.parseObject(this.parameters),
      sessionId: this.sessionId,
    });
    $.export("$summary", "Context has been created.");
    return response[0];
  },
};
