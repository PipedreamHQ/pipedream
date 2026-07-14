import app from "../../whisper.app.mjs";

export default {
  key: "whisper-graph-nameserver-hijack-dns-consistency",
  name: "Graph: Nameserver & DNS Delegation Audit",
  description: "Check a domain's name servers for the misconfigurations that enable DNS hijacking. Audits delegation, flags stale/mismatched/lame nameservers, sizes each provider’s share, surfaces registry facts - catches delegation weakness before exploit. Runs the `nameserver-hijack-dns-consistency` multi-step flow on the whisper.security graph (keyed - connect your Whisper API key). [See the documentation](https://www.whisper.security/docs/recipes/dns-email)",
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
      description: "The domain the recipe runs against. [Docs](https://www.whisper.security/docs/recipes/dns-email)",
      default: "google.com",
    },
  },
  async run({ $ }) {
    const result = await this.app.runGraphRecipe({
      $,
      id: "nameserver-hijack-dns-consistency",
      values: {
        domain: this.domain,
      },
    });
    $.export("$summary", this.app.graphSummary("nameserver-hijack-dns-consistency", result));
    return result;
  },
};
