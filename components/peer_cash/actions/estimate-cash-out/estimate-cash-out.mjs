import app from "../../peer_cash.app.mjs";

export default {
  key: "peer_cash-estimate-cash-out",
  name: "Estimate Cash Out",
  description: "Estimate the fiat a Base USDC cash-out receives at the live Chainlink oracle rate, with a recent-fill ETA for the platform and currency pair. This is an estimate, not a locked quote: Peer Cash charges no spread and the binding rate resolves when a buyer fills the order. Use **Get Payout Options** to find a valid platform and currency, then **Prepare Cash Out** to build the transactions that open the order. [See the documentation](https://docs.peer.xyz/developer/peer-cash).",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    amount: {
      propDefinition: [
        app,
        "amount",
      ],
      description: "The Base USDC amount to estimate, as a decimal string (e.g. `250` or `12.34`). Maximum 6 decimal places.",
    },
    platform: {
      propDefinition: [
        app,
        "platform",
      ],
      description: "The payout platform to sample fill timing for. Omit for a rate-only estimate.",
      optional: true,
    },
    currency: {
      propDefinition: [
        app,
        "currency",
        (configuredProps) => ({
          platform: configuredProps.platform,
        }),
      ],
    },
  },
  async run({ $ }) {
    const {
      app, amount, platform, currency,
    } = this;

    const estimate = await app.estimateCashOut({
      amount: app.convertToBaseUnits(amount),
      currency: currency.toUpperCase(),
      platform,
    });

    const eta = estimate.eta?.label
      ? `, ${estimate.eta.label.toLowerCase()}`
      : "";
    $.export("$summary", `${app.formatBaseUnits(estimate.amount)} USDC is about ${estimate.receiveAmount} ${estimate.currency} at ${estimate.rate}${eta}`);
    return estimate;
  },
};
