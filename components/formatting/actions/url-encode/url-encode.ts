import { defineAction } from "@pipedream/types";
import app from "../../app/formatting.app";

export default defineAction({
  name: "[Text] Encode URL",
  description: "Encode a string as a URL",
  key: "formatting-url-encode",
  version: "0.0.5",
  type: "action",
  props: {
    app,
    input: {
      label: "Input",
      description: "A valid URL as a string to be encoded.",
      type: "string",
    },
  },
  async run({ $ }): Promise<string> {
    const result = encodeURIComponent(this.input);
    $.export("$summary", "Successfully encoded URL");
    return result;
  },
});
