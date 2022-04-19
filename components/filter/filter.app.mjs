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
    operand1: {
      type: "any",
      label: "Value to evaluate",
      description: "Enter a value here or reference one from a previous step to evaluate",
    },
    condition: {
      type: "string",
      label: "Condition",
      description: "The condition for evaluation",
      options: conditions.options,
    },
    operand2: {
      type: "any",
      label: "Value to compare against",
      description: "Enter another value here or reference one from a previous step to compare the initial value against",
    },
  },
  methods: {
    checkCondition(condition, operand1, operand2) {
      switch (condition) {
      case conditions.constants.IN:
        return this.checkIfIn(operand1, operand2);
      case conditions.constants.NOT_IN:
        return this.checkIfNotIn(operand1, operand2);
      case conditions.constants.TEXT_EQUALS:
        return this.checkIfTextEquals(operand1, operand2);
      case conditions.constants.TEXT_NOT_EQUALS:
        return this.checkIfTextNotEquals(operand1, operand2);
      case conditions.constants.STARTS_WITH:
        return this.checkIfStartsWith(operand1, operand2);
      case conditions.constants.NOT_STARTS_WITH:
        return this.checkIfNotStartsWith(operand1, operand2);
      case conditions.constants.ENDS_WITH:
        return this.checkIfEndsWith(operand1, operand2);
      case conditions.constants.NOT_ENDS_WITH:
        return this.checkIfNotEndsWith(operand1, operand2);
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
        return this.checkIfFalse(operand1, operand2);
      case conditions.constants.EXISTS:
        return this.checkIfExists(operand1, operand2);
      case conditions.constants.NOT_EXISTS:
        return this.checkIfNotExists(operand1, operand2);
      default:
        return false;
      }
    },
    checkIfIn(operand1, operand2) {
      operand1 = this.convertToString(operand1);
      operand2 = this.convertToString(operand2);
      return operand1.includes(operand2);
    },
    checkIfNotIn(operand1, operand2) {
      operand1 = this.convertToString(operand1);
      operand2 = this.convertToString(operand2);
      return !operand1.includes(operand2);
    },
    checkIfTextEquals(operand1, operand2) {
      operand1 = this.convertToString(operand1);
      operand2 = this.convertToString(operand2);
      return operand1 === operand2;
    },
    checkIfTextNotEquals(operand1, operand2) {
      operand1 = this.convertToString(operand1);
      operand2 = this.convertToString(operand2);
      return operand1 !== operand2;
    },
    checkIfStartsWith(operand1, operand2) {
      operand1 = this.convertToString(operand1);
      operand2 = this.convertToString(operand2);
      return operand1.startsWith(operand2);
    },
    checkIfNotStartsWith(operand1, operand2) {
      operand1 = this.convertToString(operand1);
      operand2 = this.convertToString(operand2);
      return !operand1.startsWith(operand2);
    },
    checkIfEndsWith(operand1, operand2) {
      operand1 = this.convertToString(operand1);
      operand2 = this.convertToString(operand2);
      return operand1.endsWith(operand2);
    },
    checkIfNotEndsWith(operand1, operand2) {
      operand1 = this.convertToString(operand1);
      operand2 = this.convertToString(operand2);
      return !operand1.endsWith(operand2);
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
      operand1 = this.convertToDatetime(operand1);
      operand2 = this.convertToDatetime(operand2);
      return operand1 > operand2;
    },
    checkIfBefore(operand1, operand2) {
      operand1 = this.convertToDatetime(operand1);
      operand2 = this.convertToDatetime(operand2);
      return operand1 < operand2;
    },
    checkIfDateEquals(operand1, operand2) {
      operand1 = this.convertToDatetime(operand1);
      operand2 = this.convertToDatetime(operand2);
      return operand1.getTime() === operand2.getTime();
    },
    checkIfTrue(operand1) {
      operand1 = this.convertToBoolean(operand1);
      return operand1;
    },
    checkIfFalse(operand1) {
      operand1 = this.convertToBoolean(operand1);
      return !operand1;
    },
    checkIfExists(operand1, operand2) {
      operand1 = this.convertToObject(this.convertToString(operand1));
      operand2 = this.convertToString(operand2);
      return operand2 in operand1;
    },
    checkIfNotExists(operand1, operand2) {
      operand1 = this.convertToObject(this.convertToString(operand1));
      operand2 = this.convertToString(operand2);
      return !(operand2 in operand1);
    },
    convertToString(input) {
      return input.toString();
    },
    convertToNumber(input) {
      input = parseFloat(input);
      if (isNaN(input)) {
        throw new Error("Input cannot be converted to a number");
      }
      return input;
    },
    convertToBoolean(input) {
      input = this.convertToString(input).toLowerCase();
      if (input === "true") {
        return true;
      }
      if (input === "false") {
        return false;
      }
      throw new Error("Input cannot be converted to a boolean");
    },
    convertToDatetime(input) {
      input = this.convertToNumber(input);
      return new Date(input);
    },
    convertToObject(input) {
      return JSON.parse(input);
    },
  },
};
