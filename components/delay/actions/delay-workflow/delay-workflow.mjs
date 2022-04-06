import delay from "../../delay.app.mjs";

export default {
  name: "Delay Workflow",
  version: "0.0.{{ts}}",
  key: "delay-delay-workflow",
  description: "Delay the execution of your workflow for a specific amount of time.",
  props: {
    delay,
    delayDurationValue: {
      propDefinition: [
        delay,
        "delayDurationValue",
      ],
      label: "Duration to delay (value)",
      description: "Specify a value for how long you'd like to delay your workflow.",
    },
    delayDurationUnit: {
      propDefinition: [
        delay,
        "delayDurationUnit",
      ],
      label: "Duration to delay (unit)",
      description: "Specify the time unit for delaying the workflow.",
    },
  },
  type: "action",
  methods: {},
  async run({ $ }) {
    const milliseconds = this.delay.convertToMilliseconds();
    console.log(`${this.delayDurationValue} ${this.delayDurationUnit} = ${milliseconds} ms`);
    // What are the nuances wrt test mode? Can we show a meaningful $summary?
    // const resp = $.flow.delay(n);
    // $.export("$summary", `Successfully configured this workflow to delay for ${this.delayDurationValue} ${this.delayDurationUnit}.`);
    // return resp;
  },
};
