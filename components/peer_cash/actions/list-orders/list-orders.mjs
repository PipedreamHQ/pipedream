import app from "../../peer_cash.app.mjs";

export default {
  key: "peer_cash-list-orders",
  name: "List Orders",
  description: "List the Peer Cash orders belonging to a maker address, newest first. A Peer Cash order is an on-chain deposit keyed by its depositor, so this reads directly from the chain with no account linkage. Set In Flight to return only the orders still needing attention (`awaiting-buyer`, `matched`, `delivering`). Use **Get Order** for the full detail of one order. [See the documentation](https://docs.peer.xyz/developer/peer-cash).",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    owner: {
      propDefinition: [
        app,
        "owner",
      ],
    },
    inFlight: {
      type: "boolean",
      label: "In Flight",
      description: "Return only orders still awaiting a buyer, matched, or delivering. Defaults to returning every order.",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "The maximum number of deposits to scan. Defaults to 100.",
      min: 1,
      max: 1000,
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      app, owner, inFlight, limit,
    } = this;

    const orders = await app.orders(app.assertAddress(owner), {
      inFlight,
      limit,
    });

    $.export("$summary", `Found ${orders.length} ${inFlight
      ? "in-flight "
      : ""}order${orders.length === 1
      ? ""
      : "s"} for ${owner}`);
    return orders;
  },
};
