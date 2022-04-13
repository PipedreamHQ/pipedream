import filter from "../../filter.app.mjs";

export default {
  name: "Filter",
  version: "0.0.1",
  key: "filter-filter",
  description: "Select 2 values to compare against each other and choose whether you'd like to continue or stop your workflow based on the output.",
  type: "action",
  props: {
    filter,
    inputField: {
      propDefinition: [
        filter,
        "inputField",
      ],
    },
    condition: {
      propDefinition: [
        filter,
        "condition",
      ],
    },
    valueToCompare: {
      propDefinition: [
        filter,
        "valueToCompare",
      ],
    },
    continue: {
      propDefinition: [
        filter,
        "continue",
      ],
    },
  },
  async run({ $ }) {
    const result = this.filter.checkCondition(
      this.condition,
      this.inputField,
      this.valueToCompare,
    );

    const shouldContinue = this.filter.convertToBoolean(this.continue);
    if (!shouldContinue && result) {
      return $.flow.exit("Exiting workflow due to met condition");
    }

    if (result) {
      $.export("$summary", "TRUE - Condition was met");
    } else {
      $.export("$summary", "FALSE - Condition was not met");
    }
    return result;
  },
};
