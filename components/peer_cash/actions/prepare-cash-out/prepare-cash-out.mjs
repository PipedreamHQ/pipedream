import app from "../../peer_cash.app.mjs";

export default {
  key: "peer_cash-prepare-cash-out",
  name: "Prepare Cash Out",
  description: "Build the transactions that open a Peer Cash order, converting Base USDC into fiat paid by a buyer at the live Chainlink oracle rate. This action returns UNSIGNED transactions and never accepts a private key: the returned `txs` must be signed and submitted in order by whatever wallet holds the USDC, and the deposit is owned by whichever address submits them. Use **Get Payout Options** for a valid platform, currency, and payee format, and **Estimate Cash Out** to preview the fiat. When the response has `accessPolicyRequired: true` the platform is Venmo, Cash App, or PayPal and **Prepare Access Policy** must be run once the deposit transaction confirms, otherwise no buyer can fill the order. [See the documentation](https://docs.peer.xyz/developer/peer-cash).",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    amount: {
      propDefinition: [
        app,
        "amount",
      ],
    },
    platform: {
      propDefinition: [
        app,
        "platform",
      ],
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
    payee: {
      propDefinition: [
        app,
        "payee",
      ],
    },
    referralCode: {
      propDefinition: [
        app,
        "referralCode",
      ],
    },
  },
  async run({ $ }) {
    const {
      app, amount, platform, currency, payee, referralCode,
    } = this;

    const plan = await app.prepare({
      amount: app.toBaseUnits(amount),
      receive: {
        platform,
        currency: currency.toUpperCase(),
        payee,
      },
      referralCode,
    });

    const followUp = plan.accessPolicyRequired
      ? ", then Prepare Access Policy once it confirms"
      : "";
    $.export("$summary", `Prepared ${app.describeTxs(plan.txs)} to cash out ${amount} USDC to ${payee} on ${platform} in ${currency.toUpperCase()}${followUp}`);
    return plan;
  },
};
