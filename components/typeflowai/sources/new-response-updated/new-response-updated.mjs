import typeflowai from "../../typeflowai.app.mjs";

export default {
  key: "typeflowai-new-response-updated",
  name: "New Response Updated",
  description: "Emit new event when a response is updated within a workflow",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    typeflowai,
    workflowId: {
      propDefinition: [
        typeflowai,
        "workflowId",
      ],
    },
    responseId: {
      propDefinition: [
        typeflowai,
        "responseId",
      ],
    },
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // 15 minutes
      },
    },
  },
  methods: {
    _getPreviousResponseData() {
      return this.db.get("previousResponseData") || null;
    },
    _setPreviousResponseData(data) {
      this.db.set("previousResponseData", data);
    },
  },
  async run() {
    const previousResponseData = this._getPreviousResponseData();
    const currentResponseData = await this.typeflowai.updateResponse(this.workflowId, this.responseId);

    if (JSON.stringify(previousResponseData) !== JSON.stringify(currentResponseData)) {
      this.$emit(currentResponseData, {
        id: currentResponseData.id,
        summary: `Response ID: ${currentResponseData.id} updated`,
        ts: Date.now(),
      });
      this._setPreviousResponseData(currentResponseData);
    }
  },
};
