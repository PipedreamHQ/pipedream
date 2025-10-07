import { defineAction } from "@pipedream/types";
import app from "../../app/formatting.app";

export default defineAction({
  name: "[Data] Parse JSON",
  description: "Parse a JSON string",
  key: "formatting-parse-json",
  version: "0.0.6",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    input: {
      label: "Input",
      description: "A valid JSON format string to be parsed.",
      type: "string",
    },
  },
  async run({ $ }): Promise<object> {
    try {
      const result = JSON.parse(this.input);
      $.export("$summary", "Successfully parsed JSON string");
      return result;
    } catch (err) {
      throw new Error("Error parsing input as JSON: " + err.toString());
    }
  },
});
