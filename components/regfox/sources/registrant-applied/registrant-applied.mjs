import base from "../common/base.mjs";
// import constants from "../../common/constants.mjs";

export default {
  ...base,
  key: "regfox-registrant-applied",
  name: "New Registrant Applied",
  description: "Emit new event when a registrant applies to an event. [See docs here.](https://docs.webconnex.io/api/v2/#registration-notification)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  hooks: {
    ...base.hooks,
    async deploy() {},
  },
  methods: {
    ...base.methods,
    eventTypes() {
      return [
        "registration",
      ];
    },
    processEvent(event) {
      console.log("Emitting registration event...");
      this.$emit(event, {
        id: event.id,
        summary: `New registration: ${event.data.orderNumber}`,
        ts: new Date(event.registrationTimestamp),
      });
    },
  },
};
