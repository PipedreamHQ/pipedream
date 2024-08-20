import aidbase from "../../aidbase.app.mjs";

export default {
  key: "aidbase-start-training",
  name: "Start Training",
  description: "Kick off a training job for a specific piece of knowledge. [See the documentation](https://docs.aidbase.ai/apis/knowledge-api/reference/#put-knowledgeidtrain)",
  version: "0.0.1",
  type: "action",
  props: {
    aidbase,
    knowledgeItemId: {
      propDefinition: [
        aidbase,
        "knowledgeItemId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.aidbase.startTraining({
      $,
      knowledgeItemId: this.knowledgeItemId,
    });
    $.export("$summary", `Successfully started training FAQ with ID ${response.data.id}`);
    return response;
  },
};
