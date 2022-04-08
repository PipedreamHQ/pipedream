export default {
  type: "app",
  app: "filter",
  propDefinitions: {
    inputField: {
      type: "any",
      label: "Value to evaluate",
      description: "Enter or reference a value here to evaluate (can be a string, number, or boolean).",
    },
    // eslint-disable-next-line pipedream/props-description
    condition: {
      type: "string",
      label: "Condition for evaluation",
      options: [
        "Contains",
        "Does not contain (text)",
        "Matches exactly (text)",
        "Does not exactly match (text)",
        "In in (text)",
        "Is not in (text)",
        "Starts with (text)",
        "Does not start with (text)",
        "Ends with (text)",
        "Does not end with (text)",
        "Greater than (number)",
        "Less than (number)",
        "Is equal to (number)",
        "After (date/time)",
        "Before (date/time)",
        "Equals (date/time)",
        "Is True (boolean)",
        "Is False (boolean)",
        "Exists",
        "Does not exist",
      ],
    },
    // eslint-disable-next-line pipedream/props-description
    valueToCompare: {
      type: "any",
      label: "Value to compare against",
      description: "Enter or reference a value here to compare the initial value against (can be a string, number, or boolean).",
    },
    continue: {
      type: "string",
      label: "Continue if the condition is met?",
      options: [
        "Yes, continue the workflow",
        "No, stop the workflow",
      ],
    },
  },
  methods: {
    // this.$auth contains connected account data
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
};
