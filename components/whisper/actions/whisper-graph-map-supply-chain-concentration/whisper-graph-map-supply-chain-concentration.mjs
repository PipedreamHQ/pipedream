import app from "../../whisper.app.mjs";

export default {
  key: "whisper-graph-map-supply-chain-concentration",
  name: "Graph: Infrastructure Concentration & Resilience",
  description: "Grade an organisation for over-reliance on single providers, regions, or facilities. Grades how concentrated infra is - too much riding on one provider/region/data-centre/cable landing - surfacing SPOFs for resilience and DORA/NIS2 fourth-party risk. Runs the `map-supply-chain-concentration` multi-step flow on the whisper.security graph (keyed - connect your Whisper API key). [See the documentation](https://www.whisper.security/docs/recipes/compliance)",
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
      description: "The domain the recipe runs against (e.g. `atlassian.com`, `shopify.com`, `cloudflare.com`). [Docs](https://www.whisper.security/docs/recipes/compliance)",
      default: "atlassian.com",
    },
  },
  async run({ $ }) {
    const result = await this.app.runGraphRecipe({
      $,
      id: "map-supply-chain-concentration",
      values: {
        domain: this.domain,
      },
    });
    $.export("$summary", this.app.graphSummary("map-supply-chain-concentration", result));
    return result;
  },
};
