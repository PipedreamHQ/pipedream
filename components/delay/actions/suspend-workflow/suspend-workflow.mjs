import delay from "../../delay.app.mjs";

export default {
  name: "Suspend Workflow",
  version: "0.0.{{ts}}",
  key: "delay-suspend-workflow",
  description: "Pause the execution of your workflow for a specific amount of time, up to 24 hours.",
  props: {
    delay,
    delayDurationValue: {
      propDefinition: [
        delay,
        "delayDurationValue",
      ],
      label: "Duration to suspend (value)",
      description: "Specify a value for how long you'd like to suspend your workflow (it will be canceled after 24 hours).",
    },
    delayDurationUnit: {
      propDefinition: [
        delay,
        "delayDurationUnit",
      ],
      label: "Duration to suspend (unit)",
      description: "Specify the time unit for suspending the workflow.",
    },
  },
  type: "action",
  methods: {},
  async run({ $ }) {
    console.log(`${this.delayDurationValue} ${this.delayDurationUnit} = ${n} ms`);
    const resp = $.flow.suspend(n);
    // What are the nuances wrt test mode? Can we show a meaningful $summary?
    $.export("$summary", `Successfully configured this workflow to suspend execution for ${this.delayDurationValue} ${this.delayDurationUnit}.`);
    return resp;
  },
};
