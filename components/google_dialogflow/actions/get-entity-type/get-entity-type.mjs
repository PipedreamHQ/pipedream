import googleDialogflow from "../../google_dialogflow.app.mjs";

export default {
  type: "action",
  key: "google_dialogflow-get-entity-type",
  version: "1.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  name: "Get Entity Type",
  description: "Retrieves an Entity Type, [See REST docs](https://cloud.google.com/dialogflow/es/docs/reference/rest/v2/projects.agent.entityTypes/get) and [client API docs](https://googleapis.dev/nodejs/dialogflow/latest/google.cloud.dialogflow.v2beta1.EntityTypes.html#getEntityType2)",
  props: {
    googleDialogflow,
    name: {
      propDefinition: [
        googleDialogflow,
        "name",
      ],
    },
    languageCode: {
      propDefinition: [
        googleDialogflow,
        "languageCode",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.googleDialogflow.getEntityType({
      languageCode: this.languageCode,
      name: this.name,
    });
    $.export("$summary", "EntityType has been retrieved.");
    return response;
  },
};
