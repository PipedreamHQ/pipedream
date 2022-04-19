import filter from "../../filter.app.mjs";
import conditions from "../../common/conditions.mjs";

export default {
  props: {
    filter,
    operand1: {
      propDefinition: [
        filter,
        "operand1",
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
      props.operand2 = filter.propDefinitions.operand2;
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
      this.operand1,
      this.operand2,
    );
    return this.consolidateResult($, result);
  },
};
