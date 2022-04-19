import filter from "../../filter.app.mjs";
import conditions from "../../common/conditions.mjs";

export default {
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
      reloadProps: true,
    },
  },
  async additionalProps() {
    const props = {};
    if (this.isConditionBinary(this.condition)) {
      props.valueToCompare = filter.propDefinitions.valueToCompare;
    }
    return props;
  },
  methods: {
    isConditionBinary(condition) {
      switch (condition) {
      case conditions.constants.TRUE:
      case conditions.constants.FALSE:
      case conditions.constants.EXISTS:
      case conditions.constants.NOT_EXISTS:
        return false;
      default:
        return true;
      }
    },
  },
  async run({ $ }) {
    const result = this.filter.checkCondition(
      this.condition,
      this.inputField,
      this.valueToCompare,
    );
    return this.consolidateResult($, result);
  },
};
