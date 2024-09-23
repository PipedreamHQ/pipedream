import { defineAction } from "@pipedream/types";
import app from "../../app/formatting.app";

export default defineAction({
  name: "[Text] Decode URL",
  description: "Decode a URL string",
  key: "formatting-url-decode",
  version: "0.0.5",
  type: "action",
  props: {
    app,
    input: {
      label: "Input",
      description: "A valid URL as a string to be decoded.",
      type: "string",
    },
  },
  async run({ $ }): Promise<string> {
    const result = decodeURIComponent(this.input);
    $.export("$summary", "Successfully decoded URL");
    return result;
  },
});
