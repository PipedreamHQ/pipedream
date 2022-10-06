import conditions, { constants } from "./common/conditions.mjs";

export default {
  type: "app",
  app: "filter",
  propDefinitions: {
    condition: {
      type: "string",
      label: "Condition",
      description: "Choose a condition",
      options: conditions,
      default: conditions[0].value,
      reloadProps: true,
    },
  },
  methods: {
    checkCondition(condition, operand1, operand2) {
      switch (condition) {
      case constants.IN:
        return this.checkIfIn(operand1, operand2);
      case constants.NOT_IN:
        return !this.checkIfIn(operand1, operand2);
      case constants.TEXT_EQUALS:
        return this.checkIfTextEquals(operand1, operand2);
      case constants.TEXT_NOT_EQUALS:
        return !this.checkIfTextEquals(operand1, operand2);
      case constants.STARTS_WITH:
        return this.checkIfStartsWith(operand1, operand2);
      case constants.NOT_STARTS_WITH:
        return !this.checkIfStartsWith(operand1, operand2);
      case constants.ENDS_WITH:
        return this.checkIfEndsWith(operand1, operand2);
      case constants.NOT_ENDS_WITH:
        return !this.checkIfEndsWith(operand1, operand2);
      case constants.GREATER_THAN:
        return this.checkIfGreater(operand1, operand2);
      case constants.GREATER_THAN_EQUALS:
        return this.checkIfGreaterEquals(operand1, operand2);
      case constants.LESS_THAN:
        return this.checkIfLess(operand1, operand2);
      case constants.LESS_THAN_EQUALS:
        return this.checkIfLessEquals(operand1, operand2);
      case constants.EQUALS:
        return this.checkIfEquals(operand1, operand2);
      case constants.TRUE:
        return this.checkIfTrue(operand1, operand2);
      case constants.FALSE:
        return !this.checkIfTrue(operand1, operand2);
      case constants.IS_NULL:
        return this.checkIfIsNull(operand1);
      case constants.NOT_NULL:
        return !this.checkIfIsNull(operand1);
      case constants.IN_ARRAY:
        return this.checkIfInArray(operand1, operand2);
      case constants.NOT_IN_ARRAY:
        return !this.checkIfInArray(operand1, operand2);
      case constants.KEY_EXISTS:
        return this.checkIfKeyExists(operand1, operand2);
      case constants.KEY_NOT_EXISTS:
        return !this.checkIfKeyExists(operand1, operand2);
      default:
        throw new Error("Condition operation not supported");
      }
    },
    checkIfIn(operand1, operand2) {
      operand1 = this.convertToString(operand1);
      operand2 = this.convertToString(operand2);
      return operand1.includes(operand2);
    },
    checkIfTextEquals(operand1, operand2) {
      operand1 = this.convertToString(operand1);
      operand2 = this.convertToString(operand2);
      return operand1 === operand2;
    },
    checkIfStartsWith(operand1, operand2) {
      operand1 = this.convertToString(operand1);
      operand2 = this.convertToString(operand2);
      return operand1.startsWith(operand2);
    },
    checkIfEndsWith(operand1, operand2) {
      operand1 = this.convertToString(operand1);
      operand2 = this.convertToString(operand2);
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
    convertToString(input) {
      return input.toLowerCase();
    },
    convertToNumber(input) {
      input = parseFloat(input);
      if (isNaN(input)) {
        throw new Error("Input cannot be converted to a number");
      }
      return input;
    },
  },
};
