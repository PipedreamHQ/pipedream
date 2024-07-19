import TypeFlowAI from "../../typeflowai.app.mjs";

export default {
  key: "typeflowai-new-response-finished",
  name: "New Response Finished",
  description: "Emits a new event when a response is marked as finished. [See the documentation](https://typeflowai.com/docs/api/client/responses)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    typeflowai: {
      type: "app",
      app: "typeflowai",
    },
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
    workflowId: {
      propDefinition: [
        TypeFlowAI,
        "workflowId",
      ],
    },
    responseId: {
      propDefinition: [
        TypeFlowAI,
        "responseId",
      ],
    },
    markedBy: {
      propDefinition: [
        TypeFlowAI,
        "markedBy",
      ],
    },
  },
  methods: {
    _getPreviousResponseId() {
      return this.db.get("previousResponseId");
    },
    _setPreviousResponseId(id) {
      this.db.set("previousResponseId", id);
    },
  },
  async run() {
    const response = await this.typeflowai.markResponseAsFinished(this.responseId, {}, this.markedBy);
    if (response.id !== this._getPreviousResponseId()) {
      this.$emit(response, {
        id: response.id,
        summary: `New Response Finished: ${response.id}`,
        ts: Date.parse(response.updatedAt),
      });
      this._setPreviousResponseId(response.id);
    }
  },
};
