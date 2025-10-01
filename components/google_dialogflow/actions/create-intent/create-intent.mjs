import googleDialogflow from "../../google_dialogflow.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  type: "action",
  key: "google_dialogflow-create-intent",
  version: "1.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  name: "Create Intent",
  description: "Creates an intent, [See REST docs](https://cloud.google.com/dialogflow/es/docs/reference/rest/v2/projects.agent.intents/create) and [client API](https://googleapis.dev/nodejs/dialogflow/latest/google.cloud.dialogflow.v2beta1.Intents.html#createIntent2)",
  props: {
    googleDialogflow,
    languageCode: {
      propDefinition: [
        googleDialogflow,
        "languageCode",
      ],
      description: "Language code of the intent",
    },
    displayName: {
      propDefinition: [
        googleDialogflow,
        "displayName",
      ],
      description: "Display name of the intent",
      optional: false,
    },
    priority: {
      label: "Priority",
      description: "Intent priority",
      type: "integer",
      optional: true,
    },
    isFallback: {
      label: "Is Fallback",
      description: "Is fallback flag",
      type: "boolean",
      optional: true,
    },
    additionalFields: {
      propDefinition: [
        googleDialogflow,
        "additionalFields",
      ],
      description: "Additional fields for the intent, [See intent fields](https://googleapis.dev/nodejs/dialogflow/latest/google.cloud.dialogflow.v2beta1.IIntent.html)",
    },
  },
  async run({ $ }) {
    const response = await this.googleDialogflow.createIntent({
      languageCode: this.languageCode,
      intent: {
        name: this.name,
        displayName: this.displayName,
        priority: this.priority,
        isFallback: this.isFallback,
        ...utils.parseObject(this.additionalFields),
      },
    });
    $.export("$summary", "Intent has been created.");
    return response[0];
  },
};
