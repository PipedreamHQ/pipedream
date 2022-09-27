import common from "../common.mjs";

export default {
  key: "fullstory-segment-treshold-alert",
  name: "New Segment Treshold Alert Event",
  description: "Emit new events when segment treshold alerts occur. [See the docs here](https://developer.fullstory.com/segment-threshold-alert)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  ...common,
  methods: {
    ...common.methods,
    getMeta(event) {
      return {
        id: event?.body?.data?.id,
        ts: event?.body?.data?.timestamp ?
          new Date(event?.body?.data?.timestamp).getTime() :
          Date.now(),
        summary: `New segment treshold alert: ${event?.body?.data?.notificationUrl}`,
      };
    },
    getEvents() {
      return [
        {
          eventName: "segment.trend.alert",
        },
      ];
    },
  },
};
