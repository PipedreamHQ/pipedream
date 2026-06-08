import app from "../../filetopdf.app.mjs";

export default {
  key: "filetopdf-get-account",
  name: "Get Account Status",
  description: "Validate your API key and read the workspace plan, remaining credits, and subscription status. Free — never consumes credits. Use it as the connection test. [See the docs](https://filetopdf.dev).",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
  },
  async run({ $ }) {
    const result = await this.app.getAccount($);
    const data = (result && result.data) || {};
    const credits = typeof data.credits_remaining === "number" ? ` · ${data.credits_remaining} credits` : "";
    $.export("$summary", `FileToPDF · ${data.plan || "unknown"}${credits}`);
    return result;
  },
};
