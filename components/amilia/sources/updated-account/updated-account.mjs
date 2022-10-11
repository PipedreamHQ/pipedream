import base from "../common/base.mjs";

export default {
  ...base,
  key: "amilia-updated-account",
  name: "Updated Account",
  description: "Emit new event for every updated account in the organization",
  type: "source",
  version: "0.0.1",
  methods: {
    ...base.methods,
    getWebhookData() {
      return {
        Context: "Account",
        Action: "Update",
        Name: "Pipedream Webhook for Updated Accounts",
      };
    },
    processEvent(event) {
      const { Payload: account } = event;
      this.$emit(account, {
        id: account.Id,
        summary: `Updated account: ${account.Owners[0].AccountOwnerFullName}`,
        ts: Date.parse(event.EventTime),
      });
    },
  },
};
