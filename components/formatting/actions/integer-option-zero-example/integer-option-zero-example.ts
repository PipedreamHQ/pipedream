import { defineAction } from "@pipedream/types";
import app from "../../app/formatting.app";

export default defineAction({
  name: "Integer Option Zero Example",
  description: "Testing only",
  key: "formatting-integer-option-zero-example",
  version: "0.0.2",
  type: "action",
  props: {
    app,
    int1: {
      label: "Integer 1",
      type: "integer",
    },
    int2: {
      label: "Integer 2",
      type: "integer",
      options: [
        {
          label: "Minus One",
          value: -1,
        },
        {
          label: "Zero",
          value: 0,
        },
        {
          label: "One",
          value: 1,
        },
        {
          label: "Five",
          value: 5,
        },
      ],
    },
  },
  async run({ $ }) {
    const { int1, int2 } = this;
    $.export("$summary", "Tested successfully");
    return { int1, int2 };
  },
});
