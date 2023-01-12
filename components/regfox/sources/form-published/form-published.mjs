import base from "../common/base.mjs";
// import constants from "../../common/constants.mjs";

export default {
  ...base,
  key: "regfox-form-published",
  name: "New Form Published",
  description: "Emit new event when a form is succesfully published. [See docs here.](https://docs.webconnex.io/api/v2/#form-publish-event)",
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
        "publish",
      ];
    },
    processEvent(event) {
      console.log("Emitting form published event...");
      this.$emit(event, {
        id: event.formId,
        summary: `New form published: ${event.data.name}`,
        ts: new Date(event.datePublished),
      });
    },
  },
};
