import ddg from "../../ddg.app.mjs";

export default {
  key: "ddg-call-service",
  name: "Call Service",
  description:
    "Invoke a DDG service by catalog `service_id` or `/v1/` path. Use **Search Services** to find a `service_id`."
    + " Free and free-tier routes return results directly; priced routes return the x402 402 challenge"
    + " as data so your own x402 step can settle it and replay with a payment signature."
    + " [See the documentation](https://agents.daedalusdevelopmentgroup.com/llms.txt)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    ddg,
    agentId: {
      propDefinition: [
        ddg,
        "agentId",
      ],
    },
    service: {
      type: "string",
      label: "Service",
      description: "Catalog `service_id` from **Search Services** (e.g. `chains_gas`) or a `/v1/` path (e.g. `/v1/web-search`).",
    },
    args: {
      type: "object",
      label: "Args",
      description: "JSON arguments for the service, e.g. `{\"chain\": \"base\"}`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const out = await this.ddg.callService($, {
      service: this.service,
      args: this.args ?? {},
      agentId: this.agentId,
    });

    const status = out?.status;

    if (status === 402) {
      const requirement = out?.body?.accepts?.[0];
      $.export(
        "$summary",
        `402 Payment Required — ${requirement?.extra?.displayAmount ?? "?"} ${requirement?.extra?.assetSymbol ?? "USDC"} on ${requirement?.network ?? "?"}`,
      );
      return {
        paymentRequired: true,
        status: 402,
        service: this.service,
        accepts: out?.body?.accepts ?? [],
        payTo: requirement?.payTo,
        amount: requirement?.amount,
        network: requirement?.network,
        howToSettle:
          "Settle accepts[0] with an x402 client (USDC on Base, eip155:8453) and replay the route with the PAYMENT-SIGNATURE / X-PAYMENT header, or call this route directly from an x402-aware client.",
        challenge: out?.body,
      };
    }

    $.export("$summary", `DDG ${this.service} responded with status ${status ?? "unknown"}`);
    return {
      paymentRequired: false,
      status,
      service: this.service,
      result: out?.body ?? out,
    };
  },
};
