import filter from "../../filter.app.mjs";

export default {
  props: {
    filter,
    valueType: {
      propDefinition: [
        filter,
        "valueType",
      ],
      reloadProps: true,
    },
    condition: {
      propDefinition: [
        filter,
        "condition",
        (c) => ({
          valueType: c.valueType,
        }),
      ],
      reloadProps: true,
    },
  },
  async additionalProps() {
    const props = {};
    props.operand1 = filter.propDefinitions.operand1;
    if (this.filter.isBinary(this.valueType)) {
      props.operand2 = filter.propDefinitions.operand2;
    }
    if (this.filter.isText(this.valueType)) {
      props.caseSensitive = filter.propDefinitions.caseSensitive;
    }
    return props;
  },
  async run({ $ }) {
    const result = this.filter.checkCondition(
      this.condition,
      this.operand1,
      this.operand2,
      this.caseSensitive,
    );
    return this.consolidateResult($, result);
  },
};
