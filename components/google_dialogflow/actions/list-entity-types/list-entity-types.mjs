import googleDialogflow from "../../google_dialogflow.app.mjs";

export default {
  type: "action",
  key: "google_dialogflow-list-entity-types",
  version: "1.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  name: "List Entity Types",
  description: "Retrieves list of entity types, [See REST docs](https://cloud.google.com/dialogflow/es/docs/reference/rest/v2/projects.agent.entityTypes/list) and [client API docs](https://googleapis.dev/nodejs/dialogflow/latest/google.cloud.dialogflow.v2beta1.EntityTypes.html#listEntityTypes2)",
  props: {
    googleDialogflow,
    languageCode: {
      propDefinition: [
        googleDialogflow,
        "languageCode",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.googleDialogflow.listEntityTypes({
      languageCode: this.languageCode,
    });
    if (response[0].length) {
      $.export("$summary", `${response[0].length} entity types has been retrieved.`);
    } else {
      $.export("$summary", "No entity types has been found.");
    }
    return response[0];
  },
};
