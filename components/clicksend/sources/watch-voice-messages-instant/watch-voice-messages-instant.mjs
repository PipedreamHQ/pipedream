import constants from "../../common/constants.mjs";
import common from "../common/webhook.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "clicksend-watch-voice-messages-instant",
  name: "Watch Voice Messages (Instant)",
  description: "Emit new event when a new voice message is received or sent. [See the documentation](https://developers.clicksend.com/docs/rest/v3/#view-voice-receipts)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  hooks: {
    async activate() {
      const {
        http: { endpoint: actionAddress },
        createVoiceDeliveryReceiptRule,
        setWebhookId,
      } = this;

      const response =
        await createVoiceDeliveryReceiptRule({
          data: {
            rule_name: "PD Voice Receipts",
            match_type: constants.MATCH_TYPE.ALL_REPORTS,
            action: constants.ACTION.URL,
            action_address: actionAddress,
            enabled: constants.ENABLED,
          },
        });

      setWebhookId(response.data.receipt_rule_id);
    },
    async deactivate() {
      const {
        getWebhookId,
        deleteVoiceDeliveryReceiptRule,
      } = this;

      const receiptRuleId = getWebhookId();
      if (receiptRuleId) {
        await deleteVoiceDeliveryReceiptRule({
          receiptRuleId,
        });
      }
    },
  },
  methods: {
    ...common.methods,
    createVoiceDeliveryReceiptRule(args = {}) {
      return this.app.post({
        debug: true,
        path: "/automations/voice/receipts",
        ...args,
      });
    },
    deleteVoiceDeliveryReceiptRule({
      receiptRuleId, ...args
    } = {}) {
      return this.app.delete({
        debug: true,
        path: `/automations/voice/receipts/${receiptRuleId}`,
        ...args,
      });
    },
    generateMeta(resource) {
      return {
        id: resource.message_id,
        summary: `New Voice MSG ${resource.message_id}`,
        ts: Date.parse(resource.timestamp),
      };
    },
  },
  sampleEmit,
};
