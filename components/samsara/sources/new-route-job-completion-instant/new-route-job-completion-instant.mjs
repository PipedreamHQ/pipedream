import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "samsara-new-route-job-completion-instant",
  name: "New Route Job Completion (Instant)",
  description: "Emit new event when a job is completed on a Samsara route.",
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
        "RouteStopArrival",
      ];
    },
    getSummary({ data }) {
      return `Route ${data.route.name} successfully completed.`;
    },
    checkEvent({ data }) {
      const filteredStops = data.route.stops.filter((stop) => {
        return stop.state != "departed";
      });

      return !filteredStops.length;
    },
  },
  sampleEmit,
};
