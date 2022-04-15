import conditions from "../../common/conditions.mjs";
import filter from "../../filter.app.mjs";

export default {
  name: "Filter",
  version: "0.0.1",
  key: "filter-filter",
  description: "Select 2 values to compare against each other and choose whether you'd like to continue or stop workflow execution based on the output.",
  type: "action",
  props: {
    filter,
    continue: {
      propDefinition: [
        filter,
        "continue",
      ],
    },
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
      reloadProps: true,
    },
  },
  methods: {
    isUnary(condition) {
      switch (condition) {
      case conditions.constants.TRUE:
      case conditions.constants.FALSE:
      case conditions.constants.EXISTS:
      case conditions.constants.NOT_EXISTS:
        return true;
      default:
        return false;
      }
    },
  },
  async additionalProps() {
    const props = {};
    if (!this.isUnary(this.condition)) {
      props.valueToCompare = filter.propDefinitions.valueToCompare;
    }
    return props;
  },
  async run({ $ }) {
    const result = this.filter.checkCondition(
      this.condition,
      this.inputField,
      this.valueToCompare,
    );

    const shouldContinue = this.filter.convertToBoolean(this.continue);

    if (result ^ shouldContinue) {
      return $.flow.exit("Condition met for exiting workflow");
    }
    $.export("$summary", "Continuing workflow");
    return result;
  },
};
