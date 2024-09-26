/* eslint-disable pipedream/props-description */
/* eslint-disable pipedream/props-label */
export default {
  type: "app",
  app: "delay",
  propDefinitions: {
    delayDurationValue: {
      type: "integer",
    },
    delayDurationUnit: {
      type: "string",
      options: [
        "Milliseconds",
        "Seconds",
        "Minutes",
        "Hours",
      ],
    },
  },
  methods: {
    // $.flow.delay() API requires milliseconds
    convertToMilliseconds(unit, value) {
      switch (unit) {
      case "Milliseconds":
        return value;
      case "Seconds":
        return value * 1000;
      case "Minutes":
        return value * 1000 * 60;
      case "Hours":
        return value * 1000 * 60 * 60;
      default:
        throw new Error("something here");
      }
    },
  },
};
