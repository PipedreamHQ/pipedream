import googleDialogflow from "../../google_dialogflow.app.mjs";

export default {
  type: "action",
  key: "google_dialogflow-create-entity-type",
  version: "0.0.1",
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
    name: {
      propDefinition: [
        googleDialogflow,
        "name",
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
      optional: true,
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
        name: this.name,
        displayName: this.displayName,
        kind: this.kind,
        autoExpansionMode: this.autoExpansionMode,
        entities: this.entities,
        enableFuzzyExtraction: this.enableFuzzyExtraction,
      },
    });
    $.export("$summary", "EntityType has been created.");
    return response;
  },
};
