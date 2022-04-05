import delay from "../../delay.app.mjs";

export default {
  name: "Delay Workflow",
  version: "0.0.{{ts}}",
  key: "delay-delay-workflow",
  description: "Delay the execution of your workflow for a specific amount of time.",
  props: {
    delay,
    delayDurationValue: {
      type: "integer",
      label: "Duration to delay (value)",
      description: "Specify a value for how long you'd like to delay your workflow.",
    },
    delayDurationUnit: {
      type: "string",
      options: [
        "Milliseconds",
        "Seconds",
        "Minutes",
        "Hours",
      ],
      label: "Duration to delay (unit)",
      description: "Specify the unit for delaying the workflow.",
    },
  },
  type: "action",
  methods: {},
  async run({ $ }) {

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
    return `${this.delayDurationValue} ${this.delayDurationUnit} = ${n} ms`;
  },
};
