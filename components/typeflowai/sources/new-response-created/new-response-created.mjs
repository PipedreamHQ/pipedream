import typeflowai from "../../typeflowai.app.mjs";

export default {
  key: "typeflowai-new-response-created",
  name: "New Response Created",
  description: "Emit new event when a response is created for a workflow in TypeflowAI",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    typeflowai,
    db: "$.service.db",
    workflowId: {
      propDefinition: [
        typeflowai,
        "workflowId",
      ],
    },
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // 15 minutes
      },
    },
  },
  methods: {
    _getStoredResponseId() {
      return this.db.get("responseId");
    },
    _storeResponseId(responseId) {
      this.db.set("responseId", responseId);
    },
  },
  hooks: {
    async deploy() {
      // get and emit the last created response
      const lastResponse = await this.typeflowai.getLatestResponse(this.workflowId);
      this.$emit(lastResponse, {
        id: lastResponse.id,
        summary: `New Response: ${lastResponse.id}`,
        ts: Date.parse(lastResponse.createdAt),
      });
      this._storeResponseId(lastResponse.id);
    },
  },
  async run() {
    const storedResponseId = this._getStoredResponseId();
    const responses = await this.typeflowai.getAllResponses(this.workflowId);

    for (const response of responses) {
      if (response.id === storedResponseId) {
        // once we find the response we last emitted, we can stop
        break;
      }
      this.$emit(response, {
        id: response.id,
        summary: `New Response: ${response.id}`,
        ts: Date.parse(response.createdAt),
      });
    }

    // store the ID of the last emitted response
    this._storeResponseId(responses[0].id);
  },
};
