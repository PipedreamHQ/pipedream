import { axios } from "@pipedream/platform";
import elksApp from "../../46elks.app.mjs";

export default {
  key: "46elks-new-account-data-change",
  name: "New Account Data Change",
  description: "Emits an event when data related to your 46elks account changes, primarily used to keep an eye out for changes in account balance, name, or email. [See the documentation](https://46elks.com/docs/overview)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    elks: {
      type: "app",
      app: "46elks",
    },
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
  },
  methods: {
    ...elksApp.methods,
    generateMeta(data) {
      const {
        balance, name, email, id,
      } = data;
      const summary = `Balance: ${balance}, Name: ${name}, Email: ${email}`;
      return {
        id: `${id}-${Date.now()}`,
        summary,
        ts: Date.now(),
      };
    },
  },
  hooks: {
    async deploy() {
      // Fetch account details on first run
      const details = await this.elks.getAccountDetails();
      this.db.set("accountDetails", details);
      this.$emit(details, this.generateMeta(details));
    },
  },
  async run() {
    const previousDetails = this.db.get("accountDetails") || {};
    const currentDetails = await this.elks.getAccountDetails();

    if (this.elks.isDifferent(previousDetails, currentDetails)) {
      this.$emit(currentDetails, this.generateMeta(currentDetails));
      this.db.set("accountDetails", currentDetails);
    }
  },
};
