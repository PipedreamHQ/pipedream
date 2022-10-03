import common from "../common.mjs";

export default {
  key: "fullstory-new-pin",
  name: "New Event",
  description: "Emit new events when configured events occur. [See the docs here](https://developer.fullstory.com/create-endpoint)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  ...common,
  props: {
    ...common.props,
    eventType: {
      propDefinition: [
        common.props.app,
        "eventType",
      ],
    },
  },
  methods: {
    ...common.methods,
    getMeta(event) {
      const ts = Date.now();
      return {
        id: ts,
        ts,
        summary: `New event(${event?.body?.eventName}) ${event?.body?.data?.message}`,
      };
    },
    getEvents() {
      return [
        {
          eventName: this.eventType,
        },
      ];
    },
  },
};
