import base from "../common/base-timer.mjs";
import baseComponent from "../registrant-applied-instant/common-registrant-applied-instant.mjs";

export default {
  ...base,
  key: "regfox-registrant-applied",
  name: "New Registrant Applied",
  description: "Emit new event when a registrant applies to an event. [See docs here.](https://docs.webconnex.io/api/v2/#registration-notification)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...base.methods,
    ...baseComponent.methods,
  },
};
