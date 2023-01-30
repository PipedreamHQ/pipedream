import { defineAction } from "@pipedream/types";

export default defineAction({
  name: "[Text] Decode URL",
  description: "Decode a URL string",
  key: "expofp-url-decode",
  version: "0.0.1",
  type: "action",
  props: {
    input: {
      label: "Input",
      description: "A valid URL as a string to be decoded.",
      type: "string",
    },
  },
  async run({ $ }): Promise<string> {
    const result = decodeURIComponent(this.input);
    $.export("$summary", "Sucessfully decoded URL");
    return result;
  },
});
