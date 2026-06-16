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
    + " [See the documentation](https://docs.codex.io/api-reference/queries/tokens)",
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
      query GetTokenDetails($ids: [TokenInput!]) {
        tokens(ids: $ids) {
          address
          name
          symbol
          networkId
          decimals
          isScam
          info {
            circulatingSupply
            totalSupply
            imageThumbUrl
            imageSmallUrl
            imageLargeUrl
          }
          socialLinks {
            twitter
            discord
            telegram
            website
          }
          creatorAddress
          createdAt
          createTransactionHash
        }
      }
    `;

    let tokens;
    try {
      tokens = JSON.parse(this.tokens);
    } catch (error) {
      throw new Error("Invalid tokens input. Please provide a valid JSON array of token inputs.");
    }
    const data = await this.app.makeRequest($, QUERY, {
      ids: tokens,
    });

    const results = data.tokens;
    $.export("$summary", `Retrieved details for ${results.length} token(s)`);
    return results;
  },
};
