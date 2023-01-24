import base from "../common/base.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...base,
  key: "amilia-new-account",
  name: "New Account",
  description: "Emit new event for every created (client) account in the organization",
  type: "source",
  version: "0.0.2",
  dedupe: "unique",
  hooks: {
    ...base.hooks,
    async deploy() {
      console.log("Retrieving at most last 25 created accounts...");
      const accounts = await this.amilia.listAccounts({
        paginate: true,
      });
      for (const account of accounts.slice(-25)) {
        this.processEvent({
          Payload: account,
          EventTime: new Date(),
        });
      }
    },
  },
  methods: {
    ...base.methods,
    getWebhookData() {
      return {
        Context: constants.TRIGGERS.CONTEXT.ACCOUNT,
        Action: constants.TRIGGERS.ACTION.CREATE,
        Name: "Pipedream Webhook for New Accounts",
      };
    },
    processEvent(event) {
      const { Payload: account } = event;
      const name = this.amilia.getAccountName(account);
      console.log(`Emitting event for ${name}'s account...`);
      this.$emit(account, {
        id: account.Id,
        summary: `New account created: ${name}`,
        ts: Date.parse(event.EventTime),
      });
    },
  },
};
