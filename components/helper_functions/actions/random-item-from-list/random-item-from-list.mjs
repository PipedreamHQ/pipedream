import helperFunctions from "../../helper_functions.app.mjs";

export default {
  key: "helper_functions-random-item-from-list",
  name: "Random Item from List",
  description: "Returns a randomly selected value from a user-defined list of options.",
  version: "0.0.1",
  type: "action",
  props: {
    helperFunctions,
    list: {
      type: "string[]",
      label: "List",
      description: "List of items. Can pass an array from a previous step.",
    },
  },
  run() {
    return this.list[Math.floor(Math.random() * this.list.length)];
  },
};
