import base from "../common/base.mjs";

export default {
  ...base,
  key: "amilia-new-account",
  name: "New Account",
  description: "Emit new event for every created account in the organization",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...base.methods,
    getWebhookData() {
      return {
        Context: "Account",
        Action: "Create",
        Name: "Pipedream Webhook for New Accounts",
      };
    },
    processEvent(event) {
      const { Payload: account } = event;
      this.$emit(account, {
        id: account.Id,
        summary: `New account created: ${account.Owners[0].AccountOwnerFullName}`,
        ts: Date.parse(event.EventTime),
      });
    },
  },
};
