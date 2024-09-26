import { ConfigurationError } from "@pipedream/platform";
import common from "./base.mjs";

export default {
  ...common,
  props: {
    ...common.props,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
  },
  hooks: {
    async deploy() {
      const events = await this.getResources();
      this.processEvents(events);
    },
  },
  methods: {
    ...common.methods,
    getEventTypes() {
      throw new ConfigurationError("getEventType is not implemented");
    },
    getResources() {
      throw new ConfigurationError("getResources is not implemented");
    },
    processEvent(event) {
      this.$emit(event?.content ?? event, this.generateMeta(event));
    },
    processEvents(events) {
      Array.from(events).reverse()
        .forEach(this.processEvent);
    },
  },
  async run({ body }) {
    const { event_type: eventType } = body;

    if (!this.getEventTypes().includes(eventType)) {
      console.log(`Skipping event type: ${eventType}`);
      return;
    }

    this.http.respond({
      status: 200,
    });

    this.processEvent(body);
  },
};
