import app from "../../whisper.app.mjs";

export default {
  key: "whisper-graph-lookup-tor-relay",
  name: "Graph: Tor Exit-Relay Lookup (whisper.lookupTorRelay)",
  description: "Check whether an IP is a known Tor exit relay. Live Tor exit-node check: found + fingerprint + exit-address count + source + ingest time for an IPv4. Runs the `lookup-tor-relay` graph procedure on the whisper.security graph (keyed - connect your Whisper API key). [See the documentation](https://www.whisper.security/docs/whisper-graph/procedures/helpers)",
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
      description: "The value the recipe runs against. [Docs](https://www.whisper.security/docs/whisper-graph/procedures/helpers)",
      default: "185.220.101.33",
    },
  },
  async run({ $ }) {
    const result = await this.app.runGraphRecipe({
      $,
      id: "lookup-tor-relay",
      values: {
        value: this.value,
      },
    });
    $.export("$summary", this.app.graphSummary("lookup-tor-relay", result));
    return result;
  },
};
