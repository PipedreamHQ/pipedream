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
    hello: {
      type: "string",
    },
  },
  methods: {
    convertToMilliseconds() {
      // The default unit is milliseconds
      let n = 1;
      switch (this.delayDurationUnit) {
      case "Milliseconds": {
        n = this.delayDurationValue;
        break;
      }
      case "Seconds": {
        n = this.delayDurationValue * 1000;
        break;
      }
      case "Minutes": {
        n = this.delayDurationValue * 1000 * 60;
        break;
      }
      case "Hours": {
        n = this.delayDurationValue * 1000 * 60 * 60;
        break;
      }
      }
      console.log("n = " + n);
      return n;
    },
  },
};
