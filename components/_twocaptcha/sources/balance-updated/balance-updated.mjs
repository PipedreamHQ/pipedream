import { axios } from "@pipedream/platform";
import _twocaptcha from "../../_twocaptcha.app.mjs";

export default {
  key: "_twocaptcha-balance-updated",
  name: "2Captcha Balance Updated",
  description: "Emits an event when the user's balance in 2Captcha API is changed.",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    _twocaptcha,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 5, // 5 minutes
      },
    },
  },
  hooks: {
    async deploy() {
      // Initial check for balance at deployment
      const initialBalance = await this._twocaptcha.getBalance({
        clientKey: this._twocaptcha.$auth.client_key,
      });
      this.db.set("initialBalance", initialBalance);
    },
  },
  methods: {
    async getBalance() {
      return this._twocaptcha.getBalance({
        clientKey: this._twocaptcha.$auth.client_key,
      });
    },
    isBalanceChanged(currentBalance) {
      const lastBalance = this.db.get("lastBalance") || this.db.get("initialBalance");
      return currentBalance !== lastBalance;
    },
    emitBalanceChangedEvent(currentBalance) {
      this.$emit({
        balance: currentBalance,
      }, {
        id: `${currentBalance}-${Date.now()}`,
        summary: `Balance Updated: ${currentBalance}`,
        ts: Date.now(),
      });
    },
  },
  async run() {
    const currentBalance = await this.getBalance();

    if (this.isBalanceChanged(currentBalance)) {
      this.emitBalanceChangedEvent(currentBalance);
      this.db.set("lastBalance", currentBalance);
    }
  },
};
