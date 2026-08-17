import app from "../../peer_cash.app.mjs";

export default {
  key: "peer_cash-prepare-top-up",
  name: "Prepare Top Up",
  description: "Build the transactions that add more Base USDC to a live Peer Cash order, keeping the same payee and the same live oracle rate. This action returns UNSIGNED transactions and never accepts a private key: the returned `txs` are an approval followed by `addFunds` and must be signed and submitted in that order by the maker address that owns the order. Topping up an order that has already delivered or been returned fails with `ORDER_NOT_ACTIVE`; use **Get Order** to check the state first, or **Prepare Cash Out** to open a new order instead. [See the documentation](https://docs.peer.xyz/developer/peer-cash).",
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
      description: "The additional Base USDC to add to the order, as a decimal string (e.g. `250` or `12.34`). Maximum 6 decimal places.",
    },
  },
  async run({ $ }) {
    const {
      app, depositId, amount,
    } = this;

    const plan = await app.prepareTopUp(
      app.assertDepositId(depositId),
      app.convertToBaseUnits(amount),
    );

    $.export("$summary", `Prepared ${app.describeTxs(plan.txs)} to add ${amount} USDC to order ${depositId}`);
    return plan;
  },
};
