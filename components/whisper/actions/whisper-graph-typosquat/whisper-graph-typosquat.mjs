import app from "../../whisper.app.mjs";

export default {
  key: "whisper-graph-typosquat",
  name: "Graph: Typosquat & Brand-Impersonation Scanner",
  description: "Find registered look-alikes of your brand and check which ones are dangerous. Finds registered impersonations across misspellings/risky TLDs, separates your own defensive domains from strangers’, flags fresh/privacy/abuse-listed ones into a prioritised list. Runs the `typosquat` multi-step flow on the whisper.security graph (keyed - connect your Whisper API key). [See the documentation](https://www.whisper.security/docs/recipes/brand-protection)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    domain: {
      type: "string",
      label: "Domain",
      description: "The domain the recipe runs against. [Docs](https://www.whisper.security/docs/recipes/brand-protection)",
      default: "paypal.com",
    },
  },
  async run({ $ }) {
    const result = await this.app.runGraphRecipe({
      $,
      id: "typosquat",
      values: {
        domain: this.domain,
      },
    });
    $.export("$summary", this.app.graphSummary("typosquat", result));
    return result;
  },
};
