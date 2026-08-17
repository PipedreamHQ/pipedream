import app from "../../peer_cash.app.mjs";

export default {
  key: "peer_cash-prepare-withdrawal",
  name: "Prepare Withdrawal",
  description: "Build the transactions that pull USDC back out of a Peer Cash order. This action returns UNSIGNED transactions and never accepts a private key: they must be signed by the maker address that owns the order. Omit Amount to close the order entirely, which also prunes expired buyer intents first when the order needs it; pass an Amount for a partial withdrawal of the unlocked balance. A live buyer intent locks the matched funds and fails a full close with `ACTIVE_INTENT_BLOCKS_WITHDRAWAL` until it expires. Use **Get Order** to see whether `withdraw` is in `nextActions`. [See the documentation](https://docs.peer.xyz/developer/peer-cash).",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    depositId: {
      propDefinition: [
        app,
        "depositId",
      ],
    },
    amount: {
      propDefinition: [
        app,
        "amount",
      ],
      label: "Amount (USDC)",
      description: "The amount to withdraw, as a decimal string (e.g. `25` or `12.34`). Omit to close the order and withdraw everything still unlocked.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      app, depositId, amount,
    } = this;

    const plan = await app.prepareWithdraw(app.assertDepositId(depositId), amount
      ? {
        amount: app.toBaseUnits(amount),
      }
      : undefined);

    $.export("$summary", `Prepared ${app.describeTxs(plan.txs)} to ${amount
      ? `withdraw ${amount} USDC from`
      : "close"} order ${depositId}`);
    return plan;
  },
};
