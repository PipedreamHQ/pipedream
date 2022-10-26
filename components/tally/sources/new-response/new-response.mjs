import common from "../common/common.mjs";

export default {
  ...common,
  name: "New Response",
  version: "0.0.2",
  key: "tally-new-response",
  description: "Emit new event on each form message. [See docs here](https://tallyso.notion.site/Tally-OAuth-2-reference-d0442c679a464664823628f675f43454)",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getWebhookEventTypes() {
      return [
        "FORM_RESPONSE",
      ];
    },
    emitEvent(event) {
      const { data: response } = event;

      this.$emit(response, {
        id: response.responseId,
        summary: `New response for ${response.formName} form`,
        ts: response.createdAt,
      });
    },
  },
};
