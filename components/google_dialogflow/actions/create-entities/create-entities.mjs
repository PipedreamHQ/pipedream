import googleDialogflow from "../../google_dialogflow.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  type: "action",
  key: "google_dialogflow-create-entities",
  version: "1.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  name: "Create Entities",
  description: "Batch create entities, [See REST docs](https://cloud.google.com/dialogflow/es/docs/reference/rest/v2/projects.agent.entityTypes.entities/batchCreate) and [client API docs](https://googleapis.dev/nodejs/dialogflow/latest/google.cloud.dialogflow.v2beta1.EntityTypes.html#batchCreateEntities2)",
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
    entities: {
      propDefinition: [
        googleDialogflow,
        "entities",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.googleDialogflow.createEntities({
      entityTypeId: this.entityTypeId,
      languageCode: this.languageCode,
      entities: utils.parseArray(this.entities),
    });
    $.export("$summary", "Entities has been created.");
    return response;
  },
};
