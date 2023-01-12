import base from "../common/base.mjs";

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
    async deploy() {
      await this.listHistoricalEvents(this.regfox.listRegistrants);
    },
  },
  methods: {
    ...base.methods,
    eventTypes() {
      return [
        "registration",
      ];
    },
    emitEvent({
      event, id, name, ts,
    }) {
      console.log("Emitting registration event...");
      this.$emit(event, {
        id,
        summary: `New registration: ${name}`,
        ts: new Date(ts),
      });
    },
    processEvent(event) {
      this.emitEvent({
        event,
        id: event.id,
        name: event.data.orderNumber,
        ts: event.registrationTimestamp,
      });
    },
  },
};
