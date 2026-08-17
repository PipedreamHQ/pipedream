import app from "../../peer_cash.app.mjs";

export default {
  key: "peer_cash-get-payout-options",
  name: "Get Payout Options",
  description: "List every payout platform Peer Cash supports, the fiat currencies each one can be paid in, the payee handle format it expects, the Base USDC amount bounds, and the pricing model. Call this first: **Estimate Cash Out** and **Prepare Cash Out** only accept a platform and currency returned here. [See the documentation](https://docs.peer.xyz/developer/peer-cash).",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    platform: {
      propDefinition: [
        app,
        "platform",
      ],
      description: "Return only this platform's payout options. Omit to return every supported platform.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      app, platform,
    } = this;

    const capabilities = app.capabilities();

    if (!platform) {
      $.export("$summary", `Found ${capabilities.platforms.length} payout platforms across ${capabilities.currencies.length} currencies`);
      return capabilities;
    }

    const match = capabilities.platforms.find((entry) => entry.platform === platform);
    if (!match) {
      $.export("$summary", `No payout platform named "${platform}"`);
      return {
        ...capabilities,
        platforms: [],
      };
    }

    $.export("$summary", `Found ${match.currencies.length} ${match.currencies.length === 1
      ? "currency"
      : "currencies"} for ${platform}`);
    return {
      ...capabilities,
      platforms: [
        match,
      ],
    };
  },
};
