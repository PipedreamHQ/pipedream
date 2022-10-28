import filter from "../../filter.app.mjs";
import {
  binaryConditions,
  textConditions,
} from "../../common/conditions.mjs";

export default {
  props: {
    filter,
    messageOnContinue: {
      type: "string",
      label: "Reason for continuing",
      description: "The message that will be displayed when the workflow **continues**",
      optional: true,
    },
    messageOnEnd: {
      type: "string",
      label: "Reason for ending",
      description: "The message that will be displayed when the workflow **ends**",
      optional: true,
    },
    initialValue: {
      type: "any",
      label: "Initial value",
      description: "The 1st of 2 values to compare",
    },
    condition: {
      propDefinition: [
        filter,
        "condition",
      ],
    },
  },
  async additionalProps() {
    const props = {};
    if (binaryConditions.includes(this.condition)) {
      props.secondValue = {
        type: "any",
        label: "Second value",
        description: "The 2nd of 2 values to compare",
      };
    }
    if (textConditions.includes(this.condition)) {
      props.caseSensitive = {
        type: "boolean",
        label: "Case Sensitive",
        description: "Whether the text evaluation should be case sensitive or not",
        optional: true,
        default: false,
      };
    }
    return props;
  },
  async run({ $ }) {
    const result = this.filter.checkCondition(
      this.condition,
      this.initialValue,
      this.secondValue,
      this.caseSensitive,
    );
    return this.consolidateResult($, result);
  },
};
