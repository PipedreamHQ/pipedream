import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import constantContact from "../../constant_contact.app.mjs";

export default {
  key: "constant_contact-new-account-created",
  name: "New Account Created",
  description: "Emit new event when a new email account is created.",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    constantContact,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _getLastId() {
      return this.db.get("lastId") || 0;
    },
    _setLastId(lastId) {
      this.db.set("lastId", lastId);
    },
    async startEvent(maxResults) {
      const lastId = this._getLastId();
      const accounts = (await this.constantContact.listAccounts())
        .filter((account) => account.email_id > lastId)
        .sort((a, b) => b.email_id - a.email_id);

      if (!accounts.length) {
        console.log("No new accounts found");
        return;
      }

      if (maxResults && accounts.length > maxResults) {
        accounts.length = maxResults;
      }
      this._setLastId(accounts[0].email_id);

      for (const account of accounts.reverse()) {
        this.$emit(
          account,
          {
            id: account.email_id,
            summary: `A new account with ID: ${account.email_id} was created!`,
            ts: Date.now(),
          },
        );
      }
    },
  },
  hooks: {
    async deploy() {
      await this.startEvent(25);
    },
  },
  async run() {
    await this.startEvent();
  },
};
