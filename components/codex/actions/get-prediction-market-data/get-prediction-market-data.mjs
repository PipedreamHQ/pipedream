import app from "../../codex.app.mjs";

export default {
  key: "codex-get-prediction-market-data",
  name: "Get Prediction Market Data",
  description:
    "Returns prediction market outcomes (Polymarket, Kalshi) with current prices and implied probabilities."
    + " Use this to find active prediction markets about a topic and see how the market prices each outcome."
    + " Filter by keyword phrase (e.g., `Bitcoin`, `election`) and optionally by network."
    + " **Requires a Codex Growth or Enterprise plan** — returns an error on free/Starter plans."
    + " Use **Get Networks** to resolve the numeric `networkId` if needed."
    + " Supports offset-based pagination — pass `offset` (and optional `limit`) to fetch subsequent pages (e.g., `offset: 20` with `limit: 20` fetches the second page)."
    + " [See the documentation](https://docs.codex.io/api-reference/queries/filterpredictionmarkets)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    phrase: {
      type: "string",
      label: "Search Phrase",
      description: "Keyword to search for prediction markets (e.g., `Bitcoin price`, `US election`, `ETH`). Leave blank to browse all markets.",
      optional: true,
    },
    networkId: {
      propDefinition: [
        app,
        "networkId",
      ],
      optional: true,
      description: "Filter by blockchain network (e.g., 137 for Polygon where Polymarket contracts live). Use **Get Networks** to find IDs. Leave blank for all networks.",
    },
    limit: {
      propDefinition: [
        app,
        "limit",
      ],
      default: 20,
    },
    offset: {
      type: "integer",
      label: "Offset",
      description: "Number of results to skip. Use with `limit` to page through results (e.g., `offset: 20`, `limit: 20` fetches the second page).",
      optional: true,
      default: 0,
    },
  },
  async run({ $ }) {
    const QUERY = `
      query FilterPredictionMarkets($phrase: String, $limit: Int, $offset: Int) {
        filterPredictionMarkets(phrase: $phrase, limit: $limit, offset: $offset) {
          results {
            id
            slug
            marketType
          }
          count
        }
      }
    `;

    const data = await this.app.makeRequest($, QUERY, {
      phrase: this.phrase || undefined,
      limit: this.limit,
      offset: this.offset || 0,
    });

    const result = data.filterPredictionMarkets;
    const count = result.results?.length ?? 0;
    const phrase = this.phrase
      ? ` matching "${this.phrase}"`
      : "";
    $.export("$summary", `Retrieved ${count} prediction market(s)${phrase}`);
    return result;
  },
};
