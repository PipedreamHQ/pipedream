import base from "../common/base-timer.mjs";
import baseComponent from "../deposit-completed-instant/common-deposit-completed-instant.mjs";

export default {
  ...base,
  key: "regfox-deposit-completed",
  name: "New Deposit Completed",
  description: "Emit new event when a subscription or deposit has been completed. [See docs here.](https://docs.webconnex.io/api/v2/#subscription-reoccurring-notification)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...base.methods,
    ...baseComponent.methods,
  },
};
