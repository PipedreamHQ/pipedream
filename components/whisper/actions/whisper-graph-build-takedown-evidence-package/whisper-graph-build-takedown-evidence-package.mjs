import app from "../../whisper.app.mjs";

export default {
  key: "whisper-graph-build-takedown-evidence-package",
  name: "Graph: Takedown Evidence Package",
  description: "Assemble a ready-to-submit dossier for taking down a scam or phishing domain. One-pass takedown package: reputation verdict, owner (WHOIS), abuse-list listings, and surrounding infrastructure, laid out ready to hand to a registrar/host. Runs the `build-takedown-evidence-package` multi-step flow on the whisper.security graph (keyed - connect your Whisper API key). [See the documentation](https://www.whisper.security/docs/recipes/threat-intel)",
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
      description: "The domain the recipe runs against (e.g. `ickaoex.com`, `bodis.com`, `paypal.com`). [Docs](https://www.whisper.security/docs/recipes/threat-intel)",
      default: "ickaoex.com",
    },
  },
  async run({ $ }) {
    const result = await this.app.runGraphRecipe({
      $,
      id: "build-takedown-evidence-package",
      values: {
        domain: this.domain,
      },
    });
    $.export("$summary", this.app.graphSummary("build-takedown-evidence-package", result));
    return result;
  },
};
