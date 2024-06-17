import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "samsara-new-route-started-instant",
  name: "New Route Started (Instant)",
  description: "Emit new event when a new route is stated.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
  },
  methods: {
    ...common.methods,
    getEventTypes() {
      return [
        "RouteStopDeparture",
      ];
    },
    getSummary({ data }) {
      return `New route with Id: ${data.route.id} successfully started!`;
    },
    checkEvent({ data }) {
      const filteredStops = data.route.stops.filter((stop) => {
        return stop.state === "departed";
      });

      return filteredStops.length === 1;
    },
  },
  sampleEmit,
};
