import app from "../../codex.app.mjs";

export default {
  key: "codex-get-token-details",
  name: "Get Token Details",
  description:
    "Fetches current price, market cap, volume, liquidity, and metadata for one or more specific tokens by contract address."
    + " Use this when you already know the token address(es) and want to look up their current data."
    + " To discover tokens by name or ranking instead, use **Filter Tokens**."
    + " Use **Get Networks** first to resolve the numeric `networkId` if needed."
    + " Accepts a JSON array of `{address, networkId}` objects — example: `[{\"address\": \"0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2\", \"networkId\": 1}]`."
    + " [See the documentation](https://docs.codex.io/reference/filtertokens)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    tokens: {
      type: "string",
      label: "Tokens",
      description:
        "JSON array of token inputs. Each entry must have `address` (contract address) and `networkId` (numeric chain ID)."
        + " Example: `[{\"address\": \"0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2\", \"networkId\": 1}]`."
        + " Use **Get Networks** to find the `networkId` for a chain.",
    },
  },
  async run({ $ }) {
    const QUERY = `
      query GetTokenDetails($tokens: [String], $limit: Int) {
        filterTokens(tokens: $tokens, limit: $limit) {
          results {
            token {
              address
              name
              symbol
              networkId
              decimals
            }
            priceUSD
            marketCap
            volume24
            liquidity
            change24
          }
          count
        }
      }
    `;

    const parsed = JSON.parse(this.tokens);
    const tokens = parsed.map((t) =>
      typeof t === "string"
        ? t
        : `${t.address}:${t.networkId}`);
    const data = await this.app.makeRequest($, QUERY, {
      tokens,
      limit: tokens.length,
    });

    const results = data.filterTokens.results;
    $.export("$summary", `Retrieved details for ${results.length} token(s)`);
    return results;
  },
};
