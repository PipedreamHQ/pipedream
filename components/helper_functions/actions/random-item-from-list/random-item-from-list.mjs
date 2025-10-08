import helperFunctions from "../../helper_functions.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "helper_functions-random-item-from-list",
  name: "Random Item(s) from List",
  description:
    "Returns a randomly selected value(s) from a user-defined list of options.",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    helperFunctions,
    list: {
      type: "string[]",
      label: "List",
      description: "List of items. Can pass an array from a previous step.",
    },
    quantity: {
      type: "integer",
      label: "Quantity",
      description: "How many items to return.",
      default: 1,
      min: 1,
    },
  },
  run() {
    if (this.quantity > this.list.length) {
      throw new ConfigurationError("Quantity must be smaller than the list size");
    }

    return [
      ...Array(this.quantity),
    ].map(() => this.list.splice(Math.floor(Math.random() * this.list.length), 1)[0]);
  },
};
