import app from "../../whisper.app.mjs";

export default {
  key: "whisper-graph-history",
  name: "Graph: WHOIS History Timeline (whisper.history)",
  description: "Get the full historical WHOIS timeline for a domain. Every observed WHOIS snapshot over time: create/update/expiry, registrar, registrant, country, nameservers - the ownership/registration story. Runs the `history` graph procedure on the whisper.security graph (keyed - connect your Whisper API key). [See the documentation](https://www.whisper.security/docs/whisper-graph/procedures/history)",
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
      description: "The value the recipe runs against. [Docs](https://www.whisper.security/docs/whisper-graph/procedures/history)",
      default: "paypal.com",
    },
  },
  async run({ $ }) {
    const result = await this.app.runGraphRecipe({
      $,
      id: "history",
      values: {
        value: this.value,
      },
    });
    $.export("$summary", this.app.graphSummary("history", result));
    return result;
  },
};
