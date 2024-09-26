import base from "../common/base.mjs";

export default {
  ...base,
  key: "regfox-form-published-instant",
  name: "New Form Published (Instant)",
  description: "Emit new event when a form is succesfully published. [See docs here.](https://docs.webconnex.io/api/v2/#form-publish-event)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...base.methods,
    listingFunction() {
      return this.regfox.listForms;
    },
    eventTypes() {
      return [
        "publish",
      ];
    },
    emitEvent({
      event, id, name, ts,
    }) {
      console.log("Emitting form published event...");
      this.$emit(event, {
        id,
        summary: `New form published: ${name}`,
        ts: new Date(ts),
      });
    },
    processEvent(event) {
      this.emitEvent({
        event,
        id: event.formId,
        name: event.data.name,
        ts: event.datePublished,
      });
    },
  },
};
