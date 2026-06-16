import app from "../../codex.app.mjs";

export default {
  key: "codex-get-prediction-market-data",
  name: "Get Prediction Market Data",
  description:
    "Returns prediction market outcomes (Polymarket, Kalshi) with current prices and implied probabilities."
    + " Filter by keyword phrase, market IDs, event IDs, protocol, status, liquidity, volume, and more."
    + " **Requires a Codex Growth or Enterprise plan** — returns an error on free/Starter plans."
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
      description: "Text search across market questions, event labels, and categories (e.g., `Bitcoin price`, `US election`).",
      optional: true,
    },
    marketIds: {
      type: "string[]",
      label: "Market IDs",
      description: "Include only specific markets by ID (e.g., `0x4d4a...f3c2`). IDs are returned in the `id` field of previous query results.",
      optional: true,
    },
    excludeMarketIds: {
      type: "string[]",
      label: "Exclude Market IDs",
      description: "Exclude specific markets by ID (e.g., `0x4d4a...f3c2`). IDs are returned in the `id` field of previous query results.",
      optional: true,
    },
    eventIds: {
      type: "string[]",
      label: "Event IDs",
      description: "Include markets belonging to specific events by event ID (e.g., `event_abc123`). Event IDs are returned in the `id` field of prediction market event results.",
      optional: true,
    },
    excludeEventIds: {
      type: "string[]",
      label: "Exclude Event IDs",
      description: "Exclude markets belonging to specific events by event ID (e.g., `event_abc123`). Event IDs are returned in the `id` field of prediction market event results.",
      optional: true,
    },
    rankings: {
      type: "string",
      label: "Rankings",
      description: "Sort results by one or more attributes. Provide a JSON array of ranking objects, each with `attribute` (e.g., `volumeUsd24h`, `trendingScore1h`, `liquidityUsd`), `direction` (`ASC` or `DESC`), and optionally `outcome` (`outcome0` or `outcome1`) and `outcomeAttribute`. Example: `[{\"attribute\": \"volumeUsd24h\", \"direction\": \"DESC\"}]`.",
      optional: true,
    },
    filters: {
      type: "string",
      label: "Filters",
      description: "Advanced market filters as a JSON object. Supports `protocol` (array of `PredictionProtocol`), `status` (array of `PredictionEventStatus`), `categories`, `excludeCategories`, `hasCategories`, `resolutionSource`, and `NumberFilter` fields for liquidity, volume, trades, scoring, and timing (e.g., `liquidityUsd`, `volumeUsd24h`, `trendingScore1h`, `closesAt`). Each `NumberFilter` accepts `gt`, `gte`, `lt`, `lte`, `eq`. Example: `{\"status\": [\"ACTIVE\"], \"liquidityUsd\": {\"gt\": 1000}}`.",
      optional: true,
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
      query FilterPredictionMarkets(
        $phrase: String
        $marketIds: [String!]
        $excludeMarketIds: [String!]
        $eventIds: [String!]
        $excludeEventIds: [String!]
        $rankings: [PredictionMarketRanking!]
        $filters: PredictionMarketFilters
        $limit: Int
        $offset: Int
      ) {
        filterPredictionMarkets(
          phrase: $phrase
          marketIds: $marketIds
          excludeMarketIds: $excludeMarketIds
          eventIds: $eventIds
          excludeEventIds: $excludeEventIds
          rankings: $rankings
          filters: $filters
          limit: $limit
          offset: $offset
        ) {
          results {
            id
            slug
            marketType
          }
          count
        }
      }
    `;

    const variables = {
      phrase: this.phrase || undefined,
      marketIds: this.marketIds?.length
        ? this.marketIds
        : undefined,
      excludeMarketIds: this.excludeMarketIds?.length
        ? this.excludeMarketIds
        : undefined,
      eventIds: this.eventIds?.length
        ? this.eventIds
        : undefined,
      excludeEventIds: this.excludeEventIds?.length
        ? this.excludeEventIds
        : undefined,
      rankings: this.rankings
        ? JSON.parse(this.rankings)
        : undefined,
      filters: this.filters
        ? JSON.parse(this.filters)
        : undefined,
      limit: this.limit,
      offset: this.offset || 0,
    };

    const data = await this.app.makeRequest($, QUERY, variables);

    const result = data.filterPredictionMarkets;
    const count = result.results?.length ?? 0;
    const phrase = this.phrase
      ? ` matching "${this.phrase}"`
      : "";
    $.export("$summary", `Retrieved ${count} prediction market(s)${phrase}`);
    return result;
  },
};
