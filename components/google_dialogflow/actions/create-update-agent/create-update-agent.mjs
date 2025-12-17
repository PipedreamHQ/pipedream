import googleDialogflow from "../../google_dialogflow.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  type: "action",
  key: "google_dialogflow-create-update-agent",
  version: "1.0.1",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  name: "Create or Update Agent",
  description: "Creates new agent, updates if already created [See REST docs](https://cloud.google.com/dialogflow/es/docs/reference/rest/v2/projects/setAgent) and [client API](https://googleapis.dev/nodejs/dialogflow/latest/google.cloud.dialogflow.v2.Agents.html#setAgent2)",
  props: {
    googleDialogflow,
    displayName: {
      propDefinition: [
        googleDialogflow,
        "displayName",
      ],
      description: "Agent display name",
      optional: false,
    },
    defaultLanguageCode: {
      propDefinition: [
        googleDialogflow,
        "languageCode",
      ],
      label: "Default Language Code",
      description: "Agent default language code, cannot be changed during an update",
    },
    supportedLanguageCodes: {
      propDefinition: [
        googleDialogflow,
        "languageCode",
      ],
      label: "Supported Language Codes",
      type: "string[]",
      description: "Agent supported language codes",
    },
    matchMode: {
      propDefinition: [
        googleDialogflow,
        "matchMode",
      ],
    },
    additionalFields: {
      propDefinition: [
        googleDialogflow,
        "additionalFields",
      ],
      description: "Additional fields for the agent, [See agent fields](https://googleapis.dev/nodejs/dialogflow/latest/google.cloud.dialogflow.v2.IAgent.html)",
    },
  },
  async run({ $ }) {
    const response = await this.googleDialogflow.createUpdateAgent({
      displayName: this.displayName,
      defaultLanguageCode: this.defaultLanguageCode,
      supportedLanguageCodes: this.supportedLanguageCodes,
      matchMode: this.matchMode,
      ...utils.parseObject(this.additionalFields),
    });
    $.export("$summary", "Agent has been created/updated.");
    return response[0];
  },
};
