import googleDialogflow from "../../google_dialogflow.app.mjs";

export default {
  type: "action",
  key: "google_dialogflow-delete-entities",
  version: "1.0.1",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  name: "Delete Entities",
  description: "Batch delete entities, [See REST docs](https://cloud.google.com/dialogflow/es/docs/reference/rest/v2/projects.agent.entityTypes.entities/batchDelete) and [client API docs](https://googleapis.dev/nodejs/dialogflow/latest/google.cloud.dialogflow.v2beta1.EntityTypes.html#batchDeleteEntities2)",
  props: {
    googleDialogflow,
    entityTypeId: {
      propDefinition: [
        googleDialogflow,
        "entityTypeId",
      ],
    },
    languageCode: {
      propDefinition: [
        googleDialogflow,
        "languageCode",
      ],
    },
    entityValues: {
      label: "Entity Values",
      description: "Provide an array with entity values",
      type: "string[]",
    },
  },
  async run({ $ }) {
    const response = await this.googleDialogflow.deleteEntities({
      entityTypeId: this.entityTypeId,
      languageCode: this.languageCode,
      entityValues: this.entityValues,
    });
    $.export("$summary", "Entities has been deleted.");
    return response;
  },
};
