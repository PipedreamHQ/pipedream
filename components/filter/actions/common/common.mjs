import conditions from "../../common/conditions.mjs";
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
    switch (this.valueType) {
    case conditions.types.TEXT:
      return this.buildTextProps();
    case conditions.types.NUMBER:
      return this.buildNumberProps();
    case conditions.types.DATETIME:
      return this.buildDateTimeProps();
    case conditions.types.BOOLEAN:
      return this.buildBooleanProps();
    case conditions.types.NULL:
      return this.buildNullProps();
    case conditions.types.ARRAY:
      return this.buildArrayProps();
    case conditions.types.OBJECT:
      return this.buildObjectProps();
    }
  },
  methods: {
    buildTextProps() {
      return {
        operand1: {
          ...filter.propDefinitions.operand1,
          type: "string",
        },
        operand2: {
          ...filter.propDefinitions.operand2,
          type: "string",
        },
        caseSensitive: filter.propDefinitions.caseSensitive,
      };
    },
    buildNumberProps() {
      return {
        operand1: {
          ...filter.propDefinitions.operand1,
          type: "string", // needs to accept float
        },
        operand2: {
          ...filter.propDefinitions.operand2,
          type: "string", // needs to accept float
        },
      };
    },
    buildDateTimeProps() {
      return {
        operand1: {
          ...filter.propDefinitions.operand1,
          type: "integer",
        },
        operand2: {
          ...filter.propDefinitions.operand2,
          type: "integer",
        },
      };
    },
    buildBooleanProps() {
      return {
        operand1: {
          ...filter.propDefinitions.operand1,
          type: "boolean",
        },
      };
    },
    buildNullProps() {
      return {
        operand1: {
          ...filter.propDefinitions.operand1,
          type: "string",
        },
      };
    },
    buildArrayProps() {
      const props = {};
      props.arrayType = filter.propDefinitions.arrayType;

      if (this.arrayType) {
        props.operand1 = {
          ...filter.propDefinitions.operand1,
          type: this.arrayType,
        };
        props.operand2 = {
          ...filter.propDefinitions.operand2,
          type: `${this.arrayType}[]`,
        };
      } else {
        props.operand1 = filter.propDefinitions.operand1;
      }

      return props;
    },
    buildObjectProps() {
      return {
        operand1: {
          ...filter.propDefinitions.operand1,
          type: "string",
        },
        operand2: {
          ...filter.propDefinitions.operand2,
          type: "object",
        },
      };
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
