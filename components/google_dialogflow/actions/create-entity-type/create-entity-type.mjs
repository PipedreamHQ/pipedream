import googleDialogflow from "../../google_dialogflow.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  type: "action",
  key: "google_dialogflow-create-entity-type",
  version: "1.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  name: "Create Entity Type",
  description: "Creates an Entity Type, [See REST docs](https://cloud.google.com/dialogflow/es/docs/reference/rest/v2/projects.agent.entityTypes/create) and [client API docs](https://googleapis.dev/nodejs/dialogflow/latest/google.cloud.dialogflow.v2beta1.EntityTypes.html#createEntityType2)",
  props: {
    googleDialogflow,
    languageCode: {
      propDefinition: [
        googleDialogflow,
        "languageCode",
      ],
    },
    displayName: {
      propDefinition: [
        googleDialogflow,
        "displayName",
      ],
    },
    entityTypeKind: {
      propDefinition: [
        googleDialogflow,
        "entityTypeKind",
      ],
    },
    autoExpansionMode: {
      propDefinition: [
        googleDialogflow,
        "autoExpansionMode",
      ],
    },
    entities: {
      propDefinition: [
        googleDialogflow,
        "entities",
      ],
      optional: true,
    },
    enableFuzzyExtraction: {
      propDefinition: [
        googleDialogflow,
        "enableFuzzyExtraction",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.googleDialogflow.createEntityType({
      languageCode: this.languageCode,
      entityType: {
        displayName: this.displayName,
        kind: this.entityTypeKind,
        autoExpansionMode: this.autoExpansionMode,
        entities: utils.parseArray(this.entities),
        enableFuzzyExtraction: this.enableFuzzyExtraction,
      },
    });
    $.export("$summary", "EntityType has been created.");
    return response[0];
  },
};
