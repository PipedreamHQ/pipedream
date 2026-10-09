import app from "../../whisper.app.mjs";

export default {
  key: "whisper-graph-anycast-dns-root-sovereignty",
  name: "Graph: Anycast DNS-Root Sovereignty",
  description: "Assess how resilient a country's core DNS is if it were cut off from the world. Could a country still resolve names if it were isolated? Counts how many of the 13 root letters have in-country DNS_ROOT_INSTANCE anycast nodes, the Global-vs-Local split, the BGP origin ASNs hosting them, and a resilience grade. Runs the `anycast-dns-root-sovereignty` multi-step flow on the whisper.security graph (keyed - connect your Whisper API key). [See the documentation](https://www.whisper.security/docs/recipes/compliance)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    country: {
      type: "string",
      label: "Country",
      description: "The country the recipe runs against (e.g. `BR`, `US`, `DE`). [Docs](https://www.whisper.security/docs/recipes/compliance)",
      default: "BR",
    },
    instanceType: {
      type: "string",
      label: "Instance Type",
      description: "Instance Type for the recipe. [Docs](https://www.whisper.security/docs/recipes/compliance)",
      options: [
        "ALL",
        "Global",
        "Local",
      ],
      default: "ALL",
      optional: true,
    },
  },
  async run({ $ }) {
    const result = await this.app.runGraphRecipe({
      $,
      id: "anycast-dns-root-sovereignty",
      values: {
        country: this.country,
        instanceType: this.instanceType,
      },
    });
    $.export("$summary", this.app.graphSummary("anycast-dns-root-sovereignty", result));
    return result;
  },
};
