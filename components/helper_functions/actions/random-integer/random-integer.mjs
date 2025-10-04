import helperFunctions from "../../helper_functions.app.mjs";

export default {
  key: "helper_functions-random-integer",
  name: "Random Integer",
  description: "Generate a random integer (whole number). Useful for random delays.",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    helperFunctions,
    min: {
      type: "integer",
      default: 0,
      label: "Min",
      description: "Lowest possible integer",
    },
    max: {
      type: "integer",
      default: 10000,
      label: "Max",
      description: "Highest possible integer",
    },
  },
  run() {
    return Math.floor(Math.random() * (this.max - this.min + 1) + this.min);
  },
};
