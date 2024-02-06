import common from "../common/base.mjs";

export default {
  ...common,
  key: "mocean_api-balance-updated",
  name: "Balance Updated",
  description: "Emit new event when the account balance has been updated. [See the documentation](https://moceanapi.com/docs/#get-balance)",
  version: "0.0.1",
  type: "source",
  methods: {
    ...common.methods,
    _getPreviousBalance() {
      return this.db.get("previousBalance");
    },
    _setPreviousBalance(previousBalance) {
      this.db.set("previousBalance", previousBalance);
    },
    generateMeta(balance) {
      return {
        id: Date.now(),
        summary: `New Balance ${balance.value}`,
        ts: Date.now(),
      };
    },
  },
  async run() {
    const previousBalance = this._getPreviousBalance();
    const balance = await this.mocean.getBalance();
    if (balance.value !== previousBalance) {
      const meta = this.generateMeta(balance);
      this.$emit(balance, meta);
    }
    this._setPreviousBalance(balance.value);
  },
};
