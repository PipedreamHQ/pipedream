import app from "../../peer_cash.app.mjs";

export default {
  key: "peer_cash-prepare-access-policy",
  name: "Prepare Access Policy",
  description: "Build the verified-buyer access-policy transaction that a Venmo, Cash App, or PayPal order needs before any buyer can fill it. This action returns an UNSIGNED transaction and never accepts a private key: it must be signed by the maker address that owns the order. Run it only after **Prepare Cash Out** returned `accessPolicyRequired: true` and its `createDeposit` transaction has confirmed, because the policy is applied to the order the deposit created. Orders on every other platform do not need this step. [See the documentation](https://docs.peer.xyz/developer/peer-cash).",
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
  },
  async run({ $ }) {
    const {
      app, depositId,
    } = this;

    const tx = app.prepareAccessPolicy(app.assertDepositId(depositId));

    $.export("$summary", `Prepared the unsigned access-policy transaction for order ${depositId}`);
    return tx;
  },
};
