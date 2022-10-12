import base from "../common/base.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...base,
  key: "amilia-new-account",
  name: "New Account",
  description: "Emit new event for every created account in the organization",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  hooks: {
    ...base.hooks,
    async deploy() {
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
      this.$emit(account, {
        id: account.Id,
        summary: `New account created: ${account.Owners[0].AccountOwnerFullName}`,
        ts: Date.parse(event.EventTime),
      });
    },
  },
};
