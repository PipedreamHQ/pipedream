import app from "../../codex.app.mjs";

export default {
  key: "codex-get-wallet-balances",
  name: "Get Wallet Balances",
  description:
    "Returns all token holdings and USD values for a wallet address on a specific blockchain network."
    + " Use this to inspect what tokens a wallet holds."
    + " Use **Get Networks** to resolve the numeric `networkId` if needed (e.g., 1 = Ethereum, 137 = Polygon)."
    + " [See the documentation](https://docs.codex.io/reference/balances)",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    walletAddress: {
      type: "string",
      label: "Wallet Address",
      description: "On-chain wallet address to look up (e.g., `0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045`).",
    },
    networkId: {
      propDefinition: [
        app,
        "networkId",
      ],
    },
  },
  async run({ $ }) {
    const QUERY = `
      query GetWalletBalances($input: BalancesInput!) {
        balances(input: $input) {
          cursor
          items {
            tokenId
            walletId
            tokenAddress
            networkId
            balance
            shiftedBalance
            tokenPriceUsd
          }
        }
      }
    `;

    const data = await this.app.makeRequest(QUERY, {
      input: {
        walletId: `${this.walletAddress}:${this.networkId}`,
      },
    });

    const result = data.balances;
    const count = result.items?.length ?? 0;
    $.export("$summary", `Found ${count} token balance(s) for wallet ${this.walletAddress}`);
    return result;
  },
};
