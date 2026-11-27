import app from "../../whisper.app.mjs";

export default {
  key: "whisper-graph-attack-path",
  name: "Graph: Attack Path & Connection Finder",
  description: "Find the choke points an attacker would target - and how any two things connect. From a starting foothold, finds shared dependencies whose compromise reaches furthest; for any two indicators, traces how they are actually connected. Runs the `attack-path` multi-step flow on the whisper.security graph (keyed - connect your Whisper API key). [See the documentation](https://www.whisper.security/docs/recipes/attack-path)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    asset: {
      type: "string",
      label: "Asset",
      description: "The asset the recipe runs against (e.g. `github.com`, `cloudflare.com`, `coinbase.com`). [Docs](https://www.whisper.security/docs/recipes/attack-path)",
      default: "paypal.com",
    },
    other: {
      type: "string",
      label: "Other",
      description: "The other the recipe runs against. [Docs](https://www.whisper.security/docs/recipes/attack-path)",
      default: "paypa1.com",
    },
    level: {
      type: "string",
      label: "Level",
      description: "Level for the recipe. [Docs](https://www.whisper.security/docs/recipes/attack-path)",
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
      id: "attack-path",
      values: {
        asset: this.asset,
        other: this.other,
        level: this.level,
      },
    });
    $.export("$summary", this.app.graphSummary("attack-path", result));
    return result;
  },
};
