import app from "../../whisper.app.mjs";

export default {
  key: "whisper-graph-identify",
  name: "Graph: Vendor / Operator Identity (whisper.identify)",
  description: "Name the vendor and operator role behind a host or IP in one call. Resolves a host/IP to its canonical vendor, category and operator roles (DNS_OPERATOR / CDN / ORIGIN_AS / MAIL_RECEIVER) with a confidence band. Runs the `identify` graph procedure on the whisper.security graph (keyed - connect your Whisper API key). [See the documentation](https://www.whisper.security/docs/whisper-graph/procedures/identify)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    value: {
      type: "string",
      label: "Value",
      description: "The value the recipe runs against (e.g. `cloudflare.com`, `api.openai.com`, `8.8.8.8`). [Docs](https://www.whisper.security/docs/whisper-graph/procedures/identify)",
      default: "api.openai.com",
    },
  },
  async run({ $ }) {
    const result = await this.app.runGraphRecipe({
      $,
      id: "identify",
      values: {
        value: this.value,
      },
    });
    $.export("$summary", this.app.graphSummary("identify", result));
    return result;
  },
};
