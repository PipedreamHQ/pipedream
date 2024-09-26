import { defineAction } from "@pipedream/types";
import app from "../../app/formatting.app";

export default defineAction({
  name: "[Data] Convert JSON to String",
  description: "Convert an object to a JSON format string",
  key: "formatting-convert-json-to-string",
  version: "0.0.5",
  type: "action",
  props: {
    app,
    input: {
      label: "Input",
      description: "An object to be serialized to a JSON format string.",
      type: "object",
    },
  },
  async run({ $ }): Promise<string> {
    try {
      const result = JSON.stringify(this.input);
      $.export("$summary", "Successfully convert object to JSON string");
      return result;
    } catch (err) {
      throw new Error("Error serializing object to JSON string: " + err.toString());
    }
  },
});
