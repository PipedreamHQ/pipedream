import { defineAction } from "@pipedream/types";

export default defineAction({
  name: "[Text] Encode URL",
  description: "Encode a string as a URL",
  key: "expofp-url-encode",
  version: "0.0.1",
  type: "action",
  props: {
    input: {
      label: "Input",
      description: "A valid URL as a string to be encoded.",
      type: "string",
    },
  },
  async run({ $ }): Promise<string> {
    const result = encodeURIComponent(this.input);
    $.export("$summary", "Sucessfully encoded URL");
    return result;
  },
});
