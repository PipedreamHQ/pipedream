import app from "../../peer_cash.app.mjs";

export default {
  key: "peer_cash-get-order",
  name: "Get Order",
  description: "Read the current state of one Peer Cash order: whether it is `awaiting-buyer`, `matched`, `delivering`, `delivered`, or `returned`, how much has filled, the buyer fills with their locked rates and verified fiat payments, and the `nextActions` the maker can take. An order is resumable from its id alone, so this works from any workflow without prior state. A brief `ORDER_NOT_FOUND` immediately after the deposit confirms is indexer lag: retry this read rather than the transaction. Use **List Orders** to find the id. [See the documentation](https://docs.peer.xyz/developer/peer-cash).",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    depositId: {
      propDefinition: [
        app,
        "depositId",
      ],
    },
  },
  async run({ $ }) {
    const {
      app, depositId,
    } = this;

    const order = await app.order(app.assertDepositId(depositId));

    $.export("$summary", `Order ${order.depositId} is ${order.state} with ${app.fromBaseUnits(order.filledAmount)} of ${app.fromBaseUnits(order.totalAmount)} USDC filled`);
    return order;
  },
};
