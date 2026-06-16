import polydoc from "../../polydoc.app.mjs";
import { extractApiErrorMessage } from "../../common/output.mjs";

export default {
  key: "polydoc-test-connection",
  name: "Test Connection",
  description: "Validate the connected PolyDoc API key with a tiny sandbox screenshot. [See the documentation](https://docs.polydoc.tech).",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    polydoc,
  },
  async run({ $ }) {
    // Binary error bodies arrive as raw bytes; decode them to surface PolyDoc's message.
    try {
      await this.polydoc.testConnection($);
    } catch (error) {
      const message = extractApiErrorMessage(error);
      throw new Error(message
        ? `PolyDoc connection failed: ${message}`
        : `PolyDoc connection failed: ${error.message}`);
    }

    $.export("$summary", "PolyDoc API key is valid");

    return {
      success: true,
    };
  },
};
