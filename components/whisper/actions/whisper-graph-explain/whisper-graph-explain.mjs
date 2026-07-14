import app from "../../whisper.app.mjs";

export default {
  key: "whisper-graph-explain",
  name: "Graph: Threat-Feed Explainer (whisper.explain / explain)",
  description: "Score an indicator against the threat feeds and explain exactly why. Threat-intel scorer: score + level + human explanation + the feeds it is listed in (feedId, weight, firstSeen/lastSeen). Two live forms: bare CALL explain($v) (full columns) and CALL whisper.explain($v) (restricted YIELD). Runs the `explain` graph procedure on the whisper.security graph (keyed - connect your Whisper API key). [See the documentation](https://www.whisper.security/docs/whisper-graph/procedures/explain)",
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
      description: "The value the recipe runs against (e.g. `paypal.com`, `ickaoex.com`, `github.com`). [Docs](https://www.whisper.security/docs/whisper-graph/procedures/explain)",
      default: "paypal.com",
    },
  },
  async run({ $ }) {
    const result = await this.app.runGraphRecipe({
      $,
      id: "explain",
      values: {
        value: this.value,
      },
    });
    $.export("$summary", this.app.graphSummary("explain", result));
    return result;
  },
};
