import filter from "../../filter.app.mjs";
import {
  constants,
  binaryConditions,
} from "../../common/conditions.mjs";

export default {
  name: "Filter Based on Condition",
  version: "0.0.2",
  key: "filter-end-workflow-execution",
  description: "Continue or end workflow execution based on a condition",
  type: "action",
  props: {
    filter,
    continueOrEnd: {
      type: "string",
      label: "Continue or end execution?",
      description: "Specify whether you'd like to **continue** or **end** workflow execution when the below condition is met",
      options: [
        constants.CONTINUE,
        constants.END,
      ],
    },
    messageOnContinue: {
      type: "string",
      label: "Reason for continuing",
      description: "Return a message indicating why workflow execution **continued**",
      default: "Continuing workflow...",
      optional: true,
    },
    messageOnEnd: {
      type: "string",
      label: "Reason for ending",
      description: "Return a message indicating why workflow execution **ended**",
      default: "Ending workflow...",
      optional: true,
    },
    initialValue: {
      type: "any",
      label: "Initial value",
      description: "Enter a value to evaluate, or reference one from a previous step",
    },
    condition: {
      propDefinition: [
        filter,
        "condition",
      ],
    },
  },
  async additionalProps() {
    const props = {};
    if (binaryConditions.map(({ value }) => value).includes(this.condition)) {
      props.secondValue = {
        type: "any",
        label: "Second value",
        description: "Enter what you'd like to compare the first value against, or reference one from a previous step",
      };
    }
    return props;
  },
  methods: {
    consolidateResult($, result) {
      if (result) {
        this.continueOrEnd === constants.CONTINUE
          ? $.export("$summary", this.messageOnContinue)
          : $.flow.exit(this.messageOnEnd);
      } else {
        this.continueOrEnd === constants.CONTINUE
          ? $.flow.exit(this.messageOnEnd)
          : $.export("$summary", this.messageOnContinue);
      }
    },
  },
  async run({ $ }) {
    const result = this.filter.checkCondition(
      this.condition,
      this.initialValue,
      this.secondValue,
    );
    return this.consolidateResult($, result);
  },
};
