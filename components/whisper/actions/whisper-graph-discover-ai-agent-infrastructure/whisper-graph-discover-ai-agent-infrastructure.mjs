import app from "../../whisper.app.mjs";

export default {
  key: "whisper-graph-discover-ai-agent-infrastructure",
  name: "Graph: AI / Agent Infrastructure Discovery",
  description: "Map an organisation's externally visible AI and agent endpoints from the outside. Maps externally visible AI/agent hosts (API, model, agent) from the outside via heuristic hostname patterns (api./mcp./ai./vector./llm./agent./chat./copilot.). Best-effort leads. Runs the `discover-ai-agent-infrastructure` multi-step flow on the whisper.security graph (keyed - connect your Whisper API key). [See the documentation](https://www.whisper.security/docs/recipes/pentest-recon)",
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
  },
  async run({ $ }) {
    const result = await this.app.runGraphRecipe({
      $,
      id: "discover-ai-agent-infrastructure",
      values: {
        domain: this.domain,
      },
    });
    $.export("$summary", this.app.graphSummary("discover-ai-agent-infrastructure", result));
    return result;
  },
};
