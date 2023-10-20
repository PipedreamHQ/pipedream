import common from "../common.mjs";

export default {
  key: "fullstory-custom-event",
  name: "New Custom Event",
  description: "Emit new events when custom events occur. [See the docs here](https://developer.fullstory.com/custom-event)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  ...common,
  methods: {
    ...common.methods,
    getMeta(event) {
      const ts = new Date(event?.body?.timestamp).getTime();
      return {
        id: ts,
        ts,
        summary: `New custom event: ${event?.body?.data?.name}`,
      };
    },
    getEvents() {
      return [
        {
          eventName: "recording.event.custom",
        },
      ];
    },
  },
};
