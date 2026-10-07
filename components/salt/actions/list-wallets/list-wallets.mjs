import salt from "../../salt.app.mjs";

export default {
  key: "salt-list-wallets",
  name: "List Wallets",
  description: "List the connected agent's own wallets. Each entry carries `id`, `chain`,"
    + " `testnet`, `public_address`, and `name_3` (the display currency code, e.g. `ETH`)."
    + " Use this to find a wallet's `id` for **Create Payment Request**."
    + " [See the documentation](https://saltapp.ai/developers)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    salt,
  },
  async run({ $ }) {
    const wallets = await this.salt.listWallets({
      $,
    });

    $.export("$summary", `Retrieved ${wallets.length} wallet${wallets.length === 1
      ? ""
      : "s"}`);
    return wallets;
  },
};
