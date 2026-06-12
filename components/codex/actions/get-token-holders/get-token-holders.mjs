import app from "../../codex.app.mjs";

export default {
  key: "codex-get-token-holders",
  name: "Get Token Holders",
  description:
    "Returns the list of token holders with their balances and the top-10 holder concentration percentage."
    + " Use this to analyze token distribution and whale concentration."
    + " Use **Get Networks** to resolve the numeric `networkId` if needed."
    + " Supports cursor-based pagination — pass `cursor` from the previous response to fetch the next page."
    + " [See the documentation](https://docs.codex.io/reference/holders)",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    address: {
      propDefinition: [
        app,
        "tokenAddress",
      ],
    },
    networkId: {
      propDefinition: [
        app,
        "networkId",
      ],
    },
    limit: {
      propDefinition: [
        app,
        "limit",
      ],
      default: 20,
    },
    cursor: {
      propDefinition: [
        app,
        "cursor",
      ],
    },
  },
  async run({ $ }) {
    const QUERY = `
      query GetTokenHolders($input: HoldersInput!) {
        holders(input: $input) {
          cursor
          top10HoldersPercent
          items {
            address
            balance
            shiftedBalance
          }
        }
      }
    `;

    const tokenId = `${this.address}:${this.networkId}`;
    const data = await this.app.makeRequest(QUERY, {
      input: {
        tokenId,
        cursor: this.cursor || undefined,
        sort: {
          attribute: "BALANCE",
          direction: "DESC",
        },
      },
    });

    const result = data.holders;
    const count = result.items?.length ?? 0;
    $.export(
      "$summary",
      `Retrieved ${count} holder(s) for token ${this.address} (top 10 hold ${result.top10HoldersPercent?.toFixed(2) ?? "?"}%)`,
    );
    return result;
  },
};
