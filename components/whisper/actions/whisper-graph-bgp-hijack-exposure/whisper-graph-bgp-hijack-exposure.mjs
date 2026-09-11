import app from "../../whisper.app.mjs";

export default {
  key: "whisper-graph-bgp-hijack-exposure",
  name: "Graph: BGP Hijack & Routing-Hygiene Audit",
  description: "Grade a network's routing security and trace conflicts to the domains they'd expose. Grades a network on the conflicts/gaps that make route hijacking possible, then traces any conflict to the specific domains and organisations exposed on the affected blocks. Runs the `bgp-hijack-exposure` multi-step flow on the whisper.security graph (keyed - connect your Whisper API key). [See the documentation](https://www.whisper.security/docs/recipes/bgp-routing)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    asn: {
      type: "string",
      label: "Asn",
      description: "The asn the recipe runs against. [Docs](https://www.whisper.security/docs/recipes/bgp-routing)",
      default: "AS13335",
    },
  },
  async run({ $ }) {
    const result = await this.app.runGraphRecipe({
      $,
      id: "bgp-hijack-exposure",
      values: {
        asn: this.asn,
      },
    });
    $.export("$summary", this.app.graphSummary("bgp-hijack-exposure", result));
    return result;
  },
};
