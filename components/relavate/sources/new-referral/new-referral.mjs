import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "relavate-new-referral",
  name: "New Referral",
  description: "Emit new event when a new referral is created in Relavate",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    _getStartDate() {
      return this.db.get("startDate") || this._today();
    },
    _setStartDate(startDate) {
      this.db.set("startDate", startDate);
    },
    _today() {
      return new Date().toISOString()
        .split("T")[0];
    },
    getResourceFn() {
      return this.relavate.listReferrals;
    },
    getParams() {
      const startDate = this._getStartDate();
      this._setStartDate(this._today());
      return {
        startDate,
      };
    },
    getSummary(referral) {
      return `New referral with ID ${referral.id}`;
    },
  },
  sampleEmit,
};
