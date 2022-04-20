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

    if (this.filter.isArray(this.valueType)) {
      this.buildArrayProps(props);
    } else {
      props.operand1 = filter.propDefinitions.operand1;
    }

    if (this.filter.isBinary(this.valueType)) {
      props.operand2 = filter.propDefinitions.operand2;
    }

    if (this.filter.isText(this.valueType)) {
      props.caseSensitive = filter.propDefinitions.caseSensitive;
    }

    return props;
  },
  methods: {
    buildArrayProps(props) {
      props.arrayType = filter.propDefinitions.arrayType;

      if (this.arrayType) {
        props.operand1 = {
          ...filter.propDefinitions.operand1,
          type: this.arrayType,
        };
      } else {
        props.operand1 = filter.propDefinitions.operand1;
      }
    },
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
