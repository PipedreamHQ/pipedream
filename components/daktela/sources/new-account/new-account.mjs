import daktela from "../../daktela.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "daktela-new-account",
  name: "New Account Created",
  description: "Emit a new event when a new account is created. [See the documentation](https://customer.daktela.com/apihelp/v6/global/general-information)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    daktela,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // 15 minutes
      },
    },
  },
  hooks: {
    async deploy() {
      const accounts = await this.daktela._makeRequest({
        path: "/accounts",
      });

      accounts.slice(-50).forEach((account) => {
        this.$emit(account, {
          id: account.account,
          summary: `New account created: ${account.title}`,
          ts: new Date().getTime(),
        });
      });

      if (accounts.length) {
        const maxId = Math.max(...accounts.map((account) => account.account));
        await this.db.set("lastMaxAccountId", maxId);
      }
    },
  },
  async run() {
    const lastMaxAccountId = (await this.db.get("lastMaxAccountId")) || 0;

    const accounts = await this.daktela._makeRequest({
      path: "/accounts",
    });

    const newAccounts = accounts.filter((account) => account.account > lastMaxAccountId);

    newAccounts.forEach((account) => {
      this.$emit(account, {
        id: account.account,
        summary: `New account created: ${account.title}`,
        ts: new Date().getTime(),
      });
    });

    if (newAccounts.length) {
      const newMaxId = Math.max(...newAccounts.map((account) => account.account));
      await this.db.set("lastMaxAccountId", newMaxId);
    }
  },
};
