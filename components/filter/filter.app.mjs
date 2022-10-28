import conditions, { constants } from "./common/conditions.mjs";
import { ConfigurationError } from "@pipedream/platform";

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
    checkCondition(condition, operand1, operand2, caseSensitive) {
      switch (condition) {
      case constants.CONTAINS:
        return this.checkIfContains(operand1, operand2, caseSensitive);
      case constants.NOT_CONTAINS:
        return !this.checkIfContains(operand1, operand2, caseSensitive);
      case constants.TEXT_EQUALS:
        return this.checkIfTextEquals(operand1, operand2, caseSensitive);
      case constants.TEXT_NOT_EQUALS:
        return !this.checkIfTextEquals(operand1, operand2, caseSensitive);
      case constants.STARTS_WITH:
        return this.checkIfStartsWith(operand1, operand2, caseSensitive);
      case constants.NOT_STARTS_WITH:
        return !this.checkIfStartsWith(operand1, operand2, caseSensitive);
      case constants.ENDS_WITH:
        return this.checkIfEndsWith(operand1, operand2, caseSensitive);
      case constants.NOT_ENDS_WITH:
        return !this.checkIfEndsWith(operand1, operand2, caseSensitive);
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
    checkIfContains(operand1, operand2, caseSensitive) {
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
      operand2 = this.parse(operand2, "array");
      return operand2.includes(operand1);
    },
    checkIfKeyExists(operand1, operand2) {
      operand2 = this.parse(operand2, "object");
      return operand1 in operand2 && !this.checkIfIsNull(operand2[operand1]);
    },
    convertToString(input, caseSensitive) {
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
    parse(input, type) {
      if (type === "array" && Array.isArray(input)) {
        return input;
      }
      if (type === "object" && typeof input === "object" && !Array.isArray(input) && input !== null) {
        return input;
      }

      try {
        const parsed = JSON.parse(input);
        if (type === "array" && !Array.isArray(parsed)) {
          throw new Error("Unable to parse second value to array");
        }
        if (type === "object" && (typeof parsed !== "object" || Array.isArray(parsed))) {
          throw new Error("Unable to parse second value to object");
        }
        return parsed;
      } catch (e) {
        throw new ConfigurationError(e);
      }
    },
  },
};
