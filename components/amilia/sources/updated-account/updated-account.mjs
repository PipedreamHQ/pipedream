import base from "../common/base.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...base,
  key: "amilia-updated-account",
  name: "Updated Account",
  description: "Emit new event for every updated (client) account in the organization",
  type: "source",
  version: "0.0.2",
  hooks: {
    ...base.hooks,
    deploy() {
      console.log("Skipping retrieval of historical events for updated accounts");
    },
  },
  methods: {
    ...base.methods,
    getWebhookData() {
      return {
        Context: constants.TRIGGERS.CONTEXT.ACCOUNT,
        Action: constants.TRIGGERS.ACTION.UPDATE,
        Name: "Pipedream Webhook for Updated Accounts",
      };
    },
    processEvent(event) {
      const { Payload: account } = event;
      const name = this.amilia.getAccountName(account);
      console.log(`Emitting event for ${name}'s account...`);
      this.$emit(account, {
        id: account.Id,
        summary: `Updated account: ${name}`,
        ts: Date.parse(event.EventTime),
      });
    },
  },
};
