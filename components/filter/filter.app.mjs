import conditions from "./common/conditions.mjs";
import operators from "./common/operators.mjs";

export default {
  type: "app",
  app: "filter",
  propDefinitions: {
    inputField: {
      type: "any",
      label: "Value to evaluate",
      description: "Enter a value here or reference one from a previous step to evaluate.",
    },
    condition: {
      type: "string",
      label: "Condition",
      description: "The condition for evaluation",
      options: conditions.options,
      reloadProps: true,
    },
    valueToCompare: {
      type: "any",
      label: "Value to compare against",
      description: "Enter another value here or reference one from a previous step to compare the initial value against.",
    },
    logicalOperator: {
      type: "string",
      label: "Logical operator",
      description: "Configure additional conditions for evaluation using AND | OR operators.",
      options: [
        operators.AND,
        operators.OR,
      ],
      optional: true,
      reloadProps: true,
    },
    continue: {
      type: "string",
      label: "Continue workflow?",
      description: "Should workflow execution continue or stop if the condition is met?",
      options: [
        {
          label: "Continue",
          value: "true",
        },
        {
          label: "Stop",
          value: "false",
        },
      ],
      default: "true",
    },
  },
  methods: {
    checkCondition(condition, inputField, valueToCompare) {
      switch (condition) {
      case conditions.constants.IN:
        return this.checkIfIn(inputField, valueToCompare);
      case conditions.constants.NOT_IN:
        return this.checkIfNotIn(inputField, valueToCompare);
      case conditions.constants.TEXT_EQUALS:
        return this.checkIfTextEquals(inputField, valueToCompare);
      case conditions.constants.TEXT_NOT_EQUALS:
        return this.checkIfTextNotEquals(inputField, valueToCompare);
      case conditions.constants.STARTS_WITH:
        return this.checkIfStartsWith(inputField, valueToCompare);
      case conditions.constants.NOT_STARTS_WITH:
        return this.checkIfNotStartsWith(inputField, valueToCompare);
      case conditions.constants.ENDS_WITH:
        return this.checkIfEndsWith(inputField, valueToCompare);
      case conditions.constants.NOT_ENDS_WITH:
        return this.checkIfNotEndsWith(inputField, valueToCompare);
      case conditions.constants.GREATER_THAN:
        return this.checkIfGreater(inputField, valueToCompare);
      case conditions.constants.GREATER_THAN_EQUALS:
        return this.checkIfGreaterEquals(inputField, valueToCompare);
      case conditions.constants.LESS_THAN:
        return this.checkIfLess(inputField, valueToCompare);
      case conditions.constants.LESS_THAN_EQUALS:
        return this.checkIfLessEquals(inputField, valueToCompare);
      case conditions.constants.EQUALS:
        return this.checkIfEquals(inputField, valueToCompare);
      case conditions.constants.AFTER:
        return this.checkIfAfter(inputField, valueToCompare);
      case conditions.constants.BEFORE:
        return this.checkIfBefore(inputField, valueToCompare);
      case conditions.constants.DATE_EQUALS:
        return this.checkIfDateEquals(inputField, valueToCompare);
      case conditions.constants.TRUE:
        return this.checkIfTrue(inputField, valueToCompare);
      case conditions.constants.FALSE:
        return this.checkIfFalse(inputField, valueToCompare);
      case conditions.constants.EXISTS:
        return this.checkIfExists(inputField, valueToCompare);
      case conditions.constants.NOT_EXISTS:
        return this.checkIfNotExists(inputField, valueToCompare);
      default:
        return false;
      }
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
      // try {
      //   // first try to convert a timestamp
      //   input = this.convertToNumber(input);
      //   return new Date(input);
      // } catch (err) {
      //   // convert a string
      //   input = new Date(input);
      //   if (input == "Invalid Date") {
      //     throw new Error("Input can not be converted to datetime");
      //   }
      //   return input;
      // }
    },
    convertToObject(input) {
      return JSON.parse(input);
    },
    checkIfIn(inputField, valueToCompare) {
      inputField = this.convertToString(inputField);
      valueToCompare = this.convertToString(valueToCompare);
      return inputField.includes(valueToCompare);
    },
    checkIfNotIn(inputField, valueToCompare) {
      inputField = this.convertToString(inputField);
      valueToCompare = this.convertToString(valueToCompare);
      return !inputField.includes(valueToCompare);
    },
    checkIfTextEquals(inputField, valueToCompare) {
      inputField = this.convertToString(inputField);
      valueToCompare = this.convertToString(valueToCompare);
      return inputField === valueToCompare;
    },
    checkIfTextNotEquals(inputField, valueToCompare) {
      inputField = this.convertToString(inputField);
      valueToCompare = this.convertToString(valueToCompare);
      return inputField !== valueToCompare;
    },
    checkIfStartsWith(inputField, valueToCompare) {
      inputField = this.convertToString(inputField);
      valueToCompare = this.convertToString(valueToCompare);
      return inputField.startsWith(valueToCompare);
    },
    checkIfNotStartsWith(inputField, valueToCompare) {
      inputField = this.convertToString(inputField);
      valueToCompare = this.convertToString(valueToCompare);
      return !inputField.startsWith(valueToCompare);
    },
    checkIfEndsWith(inputField, valueToCompare) {
      inputField = this.convertToString(inputField);
      valueToCompare = this.convertToString(valueToCompare);
      return inputField.endsWith(valueToCompare);
    },
    checkIfNotEndsWith(inputField, valueToCompare) {
      inputField = this.convertToString(inputField);
      valueToCompare = this.convertToString(valueToCompare);
      return !inputField.endsWith(valueToCompare);
    },
    checkIfGreater(inputField, valueToCompare) {
      inputField = this.convertToNumber(inputField);
      valueToCompare = this.convertToNumber(valueToCompare);
      return inputField > valueToCompare;
    },
    checkIfGreaterEquals(inputField, valueToCompare) {
      inputField = this.convertToNumber(inputField);
      valueToCompare = this.convertToNumber(valueToCompare);
      return inputField >= valueToCompare;
    },
    checkIfLess(inputField, valueToCompare) {
      inputField = this.convertToNumber(inputField);
      valueToCompare = this.convertToNumber(valueToCompare);
      return inputField < valueToCompare;
    },
    checkIfLessEquals(inputField, valueToCompare) {
      inputField = this.convertToNumber(inputField);
      valueToCompare = this.convertToNumber(valueToCompare);
      return inputField <= valueToCompare;
    },
    checkIfEquals(inputField, valueToCompare) {
      inputField = this.convertToNumber(inputField);
      valueToCompare = this.convertToNumber(valueToCompare);
      return inputField === valueToCompare;
    },
    checkIfAfter(inputField, valueToCompare) {
      inputField = this.convertToDatetime(inputField);
      valueToCompare = this.convertToDatetime(valueToCompare);
      return inputField > valueToCompare;
    },
    checkIfBefore(inputField, valueToCompare) {
      inputField = this.convertToDatetime(inputField);
      valueToCompare = this.convertToDatetime(valueToCompare);
      return inputField < valueToCompare;
    },
    checkIfDateEquals(inputField, valueToCompare) {
      inputField = this.convertToDatetime(inputField);
      valueToCompare = this.convertToDatetime(valueToCompare);
      return inputField.getTime() === valueToCompare.getTime();
    },
    checkIfTrue(inputField) {
      inputField = this.convertToBoolean(inputField);
      return inputField;
    },
    checkIfFalse(inputField) {
      inputField = this.convertToBoolean(inputField);
      return !inputField;
    },
    checkIfExists(inputField, valueToCompare) {
      inputField = this.convertToObject(this.convertToString(inputField));
      valueToCompare = this.convertToString(valueToCompare);
      return valueToCompare in inputField;
    },
    checkIfNotExists(inputField, valueToCompare) {
      inputField = this.convertToObject(this.convertToString(inputField));
      valueToCompare = this.convertToString(valueToCompare);
      return !(valueToCompare in inputField);
    },
  },
};
