import app from "../../_46elks.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  key: "_46elks-new-account-data-change",
  name: "New Account Data Change",
  description: "Emit new event when data related to your 46elks account changes, primarily used to keep an eye out for changes in account balance, name, or email. [See the documentation](https://46elks.com/docs/overview)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  props: {
    app,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      label: "Polling Schedule",
      description: "How often to poll the API",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _getAccountDetails() {
      return this.db.get("accountDetails") || {};
    },
    _setAccountDetails(accountDetails) {
      this.db.set("accountDetails", accountDetails);
    },
    generateMeta({
      balance, displayname, email,
    } = {}) {
      const ts = Date.now();
      return {
        id: ts,
        summary: `Balance: ${balance}, Name: ${displayname}, Email: ${email}`,
        ts,
      };
    },
    hasChangedAccount(previous, current) {
      return JSON.stringify(previous) !== JSON.stringify(current);
    },
  },
  async run() {
    const {
      app,
      _getAccountDetails,
      _setAccountDetails,
      hasChangedAccount,
      $emit: emit,
    } = this;

    const previous = _getAccountDetails();
    const current = await app.getAccountDetails();

    if (hasChangedAccount(previous, current)) {
      emit(current, this.generateMeta(current));
      _setAccountDetails(current);
    }
  },
};
