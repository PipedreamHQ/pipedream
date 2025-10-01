import delay from "../../delay.app.mjs";

export default {
  name: "Delay Workflow",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  key: "delay-workflow-delay",
  type: "action",
  description: "Delay the execution of your workflow for a specific amount of time (does not count against your compute time).",
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
  async run({ $ }) {
    const milliseconds = this.delay.convertToMilliseconds(
      this.delayDurationUnit,
      this.delayDurationValue,
    );
    const resp = await $.flow.delay(milliseconds);
    $.export(
      "$summary",
      `Successfully configured this workflow to delay for ${this.delayDurationValue} ${this.delayDurationUnit}.`,
    );
    return resp;
  },
};
