import googleDialogflow from "../../google_dialogflow.app.mjs";

export default {
  type: "action",
  key: "google_dialogflow-delete-entity-type",
  version: "1.0.1",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  name: "Delete Entity Type",
  description: "Deletes an entity type, [See REST docs](https://cloud.google.com/dialogflow/es/docs/reference/rest/v2/projects.agent.entityTypes/delete) and [client API docs](https://googleapis.dev/nodejs/dialogflow/latest/google.cloud.dialogflow.v2beta1.EntityTypes.html#deleteEntityType2)",
  props: {
    googleDialogflow,
    entityTypeId: {
      propDefinition: [
        googleDialogflow,
        "entityTypeId",
      ],
    },
  },
  async run({ $ }) {
    await this.googleDialogflow.deleteEntityType({
      name: this.entityTypeId,
    });
    $.export("$summary", "Entity type has been deleted.");
  },
};
