import app from "../../whisper.app.mjs";

export default {
  key: "whisper-graph-attack-surface",
  name: "Graph: Attack-Surface Mapper",
  description: "Map everything about a domain that's exposed to the outside world, scored for risk. Maps the full external footprint - subdomains, name/mail servers, registrant, third-party services, connected web - and scores the exposure. Runs the `attack-surface` multi-step flow on the whisper.security graph (keyed - connect your Whisper API key). [See the documentation](https://www.whisper.security/docs/recipes/pentest-recon)",
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
      description: "The domain the recipe runs against. [Docs](https://www.whisper.security/docs/recipes/pentest-recon)",
      default: "github.com",
    },
    level: {
      type: "string",
      label: "Level",
      description: "Level for the recipe. [Docs](https://www.whisper.security/docs/recipes/pentest-recon)",
      options: [
        "quick",
        "standard",
        "deep",
        "comprehensive",
        "exhaustive",
      ],
      default: "standard",
      optional: true,
    },
  },
  async run({ $ }) {
    const result = await this.app.runGraphRecipe({
      $,
      id: "attack-surface",
      values: {
        domain: this.domain,
        level: this.level,
      },
    });
    $.export("$summary", this.app.graphSummary("attack-surface", result));
    return result;
  },
};
