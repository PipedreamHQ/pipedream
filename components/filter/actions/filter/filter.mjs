import filter from "../../filter.app.mjs";
import conditions from "../../common/conditions.mjs";
import operators from "../../common/operators.mjs";

export default {
  name: "Filter",
  version: "0.0.1",
  key: "filter-filter",
  description: "Select 2 values to compare against each other and choose whether you'd like to continue or stop workflow execution based on the output.",
  type: "action",
  props: {
    filter,
    continue: {
      propDefinition: [
        filter,
        "continue",
      ],
    },
    inputField_0: {
      propDefinition: [
        filter,
        "inputField",
      ],
    },
    condition_0: {
      propDefinition: [
        filter,
        "condition",
      ],
    },
  },
  methods: {
    /**
     * Returns prop key for inputField + index
     * @param {int} index
     * @returns {string} inputField key
     */
    getInputFieldKey(index) {
      return `inputField_${index}`;
    },
    /**
     * Returns prop value for inputField + index
     * @param {int} index
     * @returns {string} inputField value
     */
    getInputField(index) {
      return this[this.getInputFieldKey(index)];
    },
    /**
     * Returns prop key for condition + index
     * @param {int} index
     * @returns {string} condition key
     */
    getConditionKey(index) {
      return `condition_${index}`;
    },
    /**
     * Returns prop value for condition + index
     * @param {int} index
     * @returns {string} condition value
     */
    getCondition(index) {
      return this[this.getConditionKey(index)];
    },
    /**
     * Returns prop key for valueToCompare + index
     * @param {int} index
     * @returns {string} valueToCompare key
     */
    getValueToCompareKey(index) {
      return `valueToCompare_${index}`;
    },
    /**
     * Returns prop value for valueToCompare + index
     * @param {int} index
     * @returns {string} valueToCompare value
     */
    getValueToCompare(index) {
      return this[this.getValueToCompareKey(index)];
    },
    /**
     * Returns prop key for operator + index
     * @param {int} index
     * @returns {string} operator key
     */
    getOperatorKey(index) {
      return `operator_${index}`;
    },
    /**
     * Returns prop value for operator + index
     * @param {int} index
     * @returns {string} operator value
     */
    getOperator(index) {
      return this[this.getOperatorKey(index)];
    },
    /**
     * Checks if the condition needs one or two operands
     * @param {*} condition
     * @returns true if unary and false if binary
     */
    isUnary(condition) {
      switch (condition) {
      case conditions.constants.TRUE:
      case conditions.constants.FALSE:
      case conditions.constants.EXISTS:
      case conditions.constants.NOT_EXISTS:
        return true;
      default:
        return false;
      }
    },
    /**
     * Loads initial props:
     *   - valueToCompare_0 if condition is binary
     *   - operator_0
     * @returns {object} props
     */
    initialProps() {
      const props = {};
      if (!this.isUnary(this.getCondition(0))) {
        props[this.getValueToCompareKey(0)] = filter.propDefinitions.valueToCompare;
      }
      props[this.getOperatorKey(0)] = filter.propDefinitions.logicalOperator;
      return props;
    },
    /**
     * Loads inputField and condition props for specified index
     * @returns {object} props
     */
    loadSimpleProps(index) {
      return {
        [this.getInputFieldKey(index)]: filter.propDefinitions.inputField,
        [this.getConditionKey(index)]: filter.propDefinitions.condition,
      };
    },
    /**
     * Loads additional props for specified index:
     *   - valueToCompare_index if condition is binary
     *   - operator_index
     * @returns {object} props
     */
    loadAdditionalProps(index, loadValueToCompare) {
      const props = {};
      if (loadValueToCompare) {
        props[this.getValueToCompareKey(index)] = filter.propDefinitions.valueToCompare;
      }
      props[this.getOperatorKey(index)] = filter.propDefinitions.logicalOperator;
      return props;
    },
    /**
     * Finds the last filled operator index for loading additional props
     * @returns {int} index
     */
    getLastPropIndex() {
      let index = 0;
      while (this.getOperator(index) !== undefined) {
        index++;
      }
      return index;
    },
  },
  /**
   * It is necessary to load all additional props, in order, everytime this function is invoked
   * @returns {object} additional props
   */
  async additionalProps() {
    let props = this.initialProps();
    const lastIndex = this.getLastPropIndex();

    // load all props in order
    for (let index = 1; index <= lastIndex; index++) {
      props = {
        ...props,
        ...this.loadSimpleProps(index),
      };

      if (this.getCondition(index) !== undefined) {
        const isBinary = !this.isUnary(this.getCondition(index));
        props = {
          ...props,
          ...this.loadAdditionalProps(index, isBinary),
        };
      }
    }

    return props;
  },
  async run({ $ }) {
    // always check first condition
    let finalResult = this.filter.checkCondition(
      this.getCondition(0),
      this.getInputField(0),
      this.getValueToCompare(0),
    );

    // iterate through conditions and linearly accumulate results (parenthesis are not supported)
    let lastIndex = this.getLastPropIndex();
    for (let index = 0; index <= lastIndex; index++) {
      const operator = this.getOperator(index);

      if (operator === undefined) {
        break;
      }

      // check result for next condition
      const result = this.filter.checkCondition(
        this.getCondition(index + 1),
        this.getInputField(index + 1),
        this.getValueToCompare(index + 1),
      );

      // accumulate results
      if (operator === operators.AND) {
        finalResult = finalResult && result;
      } else if (operator === operators.OR) {
        finalResult = finalResult || result;
      } else {
        throw new Error(`Operator not supported: ${operator}`);
      }
    }

    const shouldContinue = this.filter.convertToBoolean(this.continue);

    if (finalResult ^ shouldContinue) {
      $.flow.exit("Exiting workflow");
    } else {
      $.export("$summary", "Continuing workflow");
    }
    return finalResult;
  },
};
