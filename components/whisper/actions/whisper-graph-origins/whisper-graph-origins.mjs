import app from "../../whisper.app.mjs";

export default {
  key: "whisper-graph-origins",
  name: "Graph: CDN-Origin De-cloaker (whisper.origins)",
  description: "Find the real origin IPs behind a CDN-fronted domain, ranked by confidence. Candidate origin IPs behind a CDN with confidence, the methods that found them (e.g. links_to), and the hosting ASN/name - de-cloaks to the real server. Runs the `origins` graph procedure on the whisper.security graph (keyed - connect your Whisper API key). [See the documentation](https://www.whisper.security/docs/whisper-graph/procedures/origins)",
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
      description: "The value the recipe runs against. [Docs](https://www.whisper.security/docs/whisper-graph/procedures/origins)",
      default: "cloudflare.com",
    },
  },
  async run({ $ }) {
    const result = await this.app.runGraphRecipe({
      $,
      id: "origins",
      values: {
        value: this.value,
      },
    });
    $.export("$summary", this.app.graphSummary("origins", result));
    return result;
  },
};
