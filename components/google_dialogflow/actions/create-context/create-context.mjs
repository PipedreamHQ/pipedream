import googleDialogflow from "../../google_dialogflow.app.mjs";
import utils from "../../common/utils.mjs";
import { v4 } from "uuid";

export default {
  type: "action",
  key: "google_dialogflow-create-context",
  version: "1.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
      description: "A unique session ID",
      default: v4(),
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
