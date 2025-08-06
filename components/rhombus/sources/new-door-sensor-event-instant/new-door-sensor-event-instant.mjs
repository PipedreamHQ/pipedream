import common from "../common/base-webhook.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "rhombus-new-door-sensor-event-instant",
  name: "New Door Sensor Event (Instant)",
  description: "Emit new event when a new door sensor event is created. [See the documentation](https://apidocs.rhombus.com/reference/subscribezapierwebhook)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventType() {
      return "DOOR_SENSOR_EVENTS";
    },
  },
  sampleEmit,
};
