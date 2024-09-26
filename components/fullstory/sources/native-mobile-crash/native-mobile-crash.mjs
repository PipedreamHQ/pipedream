import common from "../common.mjs";

export default {
  key: "fullstory-native-mobile-crash",
  name: "New Native Mobile Crash Event",
  description: "Emit new events when native mobile crash events occur. [See the docs here](https://developer.fullstory.com/native-mobile-crash)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  ...common,
  methods: {
    ...common.methods,
    getMeta(event) {
      const ts = Date.now();
      return {
        id: ts,
        ts,
        summary: `New native mobile crash ${event?.body?.data?.appName} on ${event?.body?.data?.deviceModel}`,
      };
    },
    getEvents() {
      return [
        {
          eventName: "nativemobile.event.crash",
        },
      ];
    },
  },
};
