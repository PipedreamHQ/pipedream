import conditions from "./common/conditions.mjs";

export default {
  type: "app",
  app: "filter",
  propDefinitions: {
    reason: {
      type: "string",
      label: "Reason",
      description: "The reason for continuing/ending the workflow. Please override this description",
      optional: true,
    },
    valueType: {
      type: "string",
      label: "Value Type",
      description: "Type of the value to evaluate",
      options: Object.keys(conditions.types),
    },
    condition: {
      type: "string",
      label: "Condition",
      description: "The condition for evaluation",
      async options({ valueType }) {
        switch (valueType) {
        case conditions.types.TEXT:
          return conditions.textOptions;
        case conditions.types.NUMBER:
          return conditions.numberOptions;
        case conditions.types.DATETIME:
          return conditions.dateTimeOptions;
        case conditions.types.BOOLEAN:
          return conditions.booleanOptions;
        case conditions.types.NULL:
          return conditions.nullOptions;
        case conditions.types.ARRAY:
          return conditions.arrayOptions;
        case conditions.types.OBJECT:
          return conditions.objectOptions;
        default:
          throw new Error("Value Type not supported");
        }
      },
    },
    operand1: {
      type: "any",
      label: "Value to evaluate",
      description: "Enter a value here or reference one from a previous step to evaluate",
    },
    operand2: {
      type: "any",
      label: "Value to compare against",
      description: "Enter another value here or reference one from a previous step to compare the initial value against",
    },
    arrayType: {
      type: "string",
      label: "Value Sub Type for Array Comparison",
      description: "Type of the value to search for in the array",
      options: [
        "string",
        "integer",
        "boolean",
      ],
      reloadProps: true,
    },
    caseSensitive: {
      type: "boolean",
      label: "Case Sensitive",
      description: "Should the text comparison be case sensitive?",
      default: false,
    },
  },
  methods: {
    checkCondition(condition, operand1, operand2, caseSensitive) {
      switch (condition) {
      case conditions.constants.IN:
        return this.checkIfIn(operand1, operand2, caseSensitive);
      case conditions.constants.NOT_IN:
        return !this.checkIfIn(operand1, operand2, caseSensitive);
      case conditions.constants.TEXT_EQUALS:
        return this.checkIfTextEquals(operand1, operand2, caseSensitive);
      case conditions.constants.TEXT_NOT_EQUALS:
        return !this.checkIfTextEquals(operand1, operand2, caseSensitive);
      case conditions.constants.STARTS_WITH:
        return this.checkIfStartsWith(operand1, operand2, caseSensitive);
      case conditions.constants.NOT_STARTS_WITH:
        return !this.checkIfStartsWith(operand1, operand2, caseSensitive);
      case conditions.constants.ENDS_WITH:
        return this.checkIfEndsWith(operand1, operand2, caseSensitive);
      case conditions.constants.NOT_ENDS_WITH:
        return !this.checkIfEndsWith(operand1, operand2, caseSensitive);
      case conditions.constants.GREATER_THAN:
        return this.checkIfGreater(operand1, operand2);
      case conditions.constants.GREATER_THAN_EQUALS:
        return this.checkIfGreaterEquals(operand1, operand2);
      case conditions.constants.LESS_THAN:
        return this.checkIfLess(operand1, operand2);
      case conditions.constants.LESS_THAN_EQUALS:
        return this.checkIfLessEquals(operand1, operand2);
      case conditions.constants.EQUALS:
        return this.checkIfEquals(operand1, operand2);
      case conditions.constants.AFTER:
        return this.checkIfAfter(operand1, operand2);
      case conditions.constants.BEFORE:
        return this.checkIfBefore(operand1, operand2);
      case conditions.constants.DATE_EQUALS:
        return this.checkIfDateEquals(operand1, operand2);
      case conditions.constants.TRUE:
        return this.checkIfTrue(operand1, operand2);
      case conditions.constants.FALSE:
        return !this.checkIfTrue(operand1, operand2);
      case conditions.constants.IS_NULL:
        return this.checkIfIsNull(operand1);
      case conditions.constants.NOT_NULL:
        return !this.checkIfIsNull(operand1);
      case conditions.constants.IN_ARRAY:
        return this.checkIfInArray(operand1, operand2);
      case conditions.constants.NOT_IN_ARRAY:
        return !this.checkIfInArray(operand1, operand2);
      case conditions.constants.KEY_EXISTS:
        return this.checkIfKeyExists(operand1, operand2);
      case conditions.constants.KEY_NOT_EXISTS:
        return !this.checkIfKeyExists(operand1, operand2);
      default:
        throw new Error("Condition operation not supported");
      }
    },
    checkIfIn(operand1, operand2, caseSensitive) {
      operand1 = this.convertToString(operand1, caseSensitive);
      operand2 = this.convertToString(operand2, caseSensitive);
      return operand1.includes(operand2);
    },
    checkIfTextEquals(operand1, operand2, caseSensitive) {
      operand1 = this.convertToString(operand1, caseSensitive);
      operand2 = this.convertToString(operand2, caseSensitive);
      return operand1 === operand2;
    },
    checkIfStartsWith(operand1, operand2, caseSensitive) {
      operand1 = this.convertToString(operand1, caseSensitive);
      operand2 = this.convertToString(operand2, caseSensitive);
      return operand1.startsWith(operand2);
    },
    checkIfEndsWith(operand1, operand2, caseSensitive) {
      operand1 = this.convertToString(operand1, caseSensitive);
      operand2 = this.convertToString(operand2, caseSensitive);
      return operand1.endsWith(operand2);
    },
    checkIfGreater(operand1, operand2) {
      operand1 = this.convertToNumber(operand1);
      operand2 = this.convertToNumber(operand2);
      return operand1 > operand2;
    },
    checkIfGreaterEquals(operand1, operand2) {
      operand1 = this.convertToNumber(operand1);
      operand2 = this.convertToNumber(operand2);
      return operand1 >= operand2;
    },
    checkIfLess(operand1, operand2) {
      operand1 = this.convertToNumber(operand1);
      operand2 = this.convertToNumber(operand2);
      return operand1 < operand2;
    },
    checkIfLessEquals(operand1, operand2) {
      operand1 = this.convertToNumber(operand1);
      operand2 = this.convertToNumber(operand2);
      return operand1 <= operand2;
    },
    checkIfEquals(operand1, operand2) {
      operand1 = this.convertToNumber(operand1);
      operand2 = this.convertToNumber(operand2);
      return operand1 === operand2;
    },
    checkIfAfter(operand1, operand2) {
      operand1 = this.convertToDateTime(operand1);
      operand2 = this.convertToDateTime(operand2);
      return operand1 > operand2;
    },
    checkIfBefore(operand1, operand2) {
      operand1 = this.convertToDateTime(operand1);
      operand2 = this.convertToDateTime(operand2);
      return operand1 < operand2;
    },
    checkIfDateEquals(operand1, operand2) {
      operand1 = this.convertToDateTime(operand1);
      operand2 = this.convertToDateTime(operand2);
      return operand1.getTime() === operand2.getTime();
    },
    checkIfTrue(operand1) {
      return operand1;
    },
    checkIfIsNull(operand1) {
      return (
        operand1 === null ||
        operand1 === undefined ||
        operand1 === "null" ||
        operand1 === "undefined"
      );
    },
    checkIfInArray(operand1, operand2) {
      return operand2.includes(operand1);
    },
    checkIfKeyExists(operand1, operand2) {
      return operand1 in operand2 && !this.checkIfIsNull(operand2[operand1]);
    },
    convertToString(input, caseSensitive = true) {
      if (!caseSensitive) {
        return input.toLowerCase();
      }
      return input;
    },
    convertToNumber(input) {
      input = parseFloat(input);
      if (isNaN(input)) {
        throw new Error("Input cannot be converted to a number");
      }
      return input;
    },
    convertToDateTime(input) {
      input = new Date(input);
      if (isNaN(input)) {
        throw new Error("Input cannot be converted to datetime");
      }
      return input;
    },
  },
};
