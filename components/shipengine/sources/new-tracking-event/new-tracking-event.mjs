import common from "../common/webhook.mjs";

export default {
  ...common,
  key: "shipengine-new-tracking-event",
  name: "New Tracking Event (Instant)",
  description: "Emit new event when a new event is tracked. [See the docs](https://shipengine.github.io/shipengine-openapi/#operation/create_webhook).",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvent() {
      return "track";
    },
    generateMeta(resource) {
      const ts = Date.parse(resource.occurred_at);
      return {
        id: ts,
        ts,
        summary: `New Tracking Event at ${resource.occurred_at}`,
      };
    },
    processEvents(response) {
      const {
        events: resources,
        ...otherProps
      } = response;

      resources
        .reverse()
        .forEach((resource) =>
          this.$emit({
            ...otherProps,
            ...resource,
          }, this.generateMeta(resource)));
    },
  },
};
