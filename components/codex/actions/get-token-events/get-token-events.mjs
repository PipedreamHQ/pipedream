import app from "../../codex.app.mjs";

export default {
  key: "codex-get-token-events",
  name: "Get Token Events",
  description:
    "Returns on-chain trading events (swaps, mints, burns) for a token or pair address."
    + " Each event includes event type, USD price, timestamp, transaction hash, and maker address."
    + " Filter by event type, wallet address, price range, timestamp window, and more."
    + " Use **Get Networks** to resolve the numeric `networkId` if needed."
    + " Supports cursor-based pagination — pass the `cursor` from the previous response to fetch the next page."
    + " [See the documentation](https://docs.codex.io/api-reference/queries/gettokenevents)",
  version: "0.0.1",
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
      description: "Token or pair contract address to fetch events for.",
    },
    networkId: {
      propDefinition: [
        app,
        "networkId",
      ],
    },
    eventType: {
      type: "string",
      label: "Event Type",
      description: "Filter by the on-chain event type.",
      options: [
        "Swap",
        "Mint",
        "Burn",
        "Sync",
        "Collect",
        "CollectProtocol",
        "PoolBalanceChanged",
        "LiquidityLock",
      ],
      optional: true,
    },
    eventDisplayType: {
      type: "string[]",
      label: "Event Display Types",
      description: "Filter by one or more display-level event types.",
      options: [
        "Buy",
        "Sell",
        "Mint",
        "Burn",
        "Sync",
        "Collect",
        "CollectProtocol",
      ],
      optional: true,
    },
    quoteToken: {
      type: "string",
      label: "Quote Token",
      description: "Filter by which token is treated as the quote token in the pair.",
      options: [
        "token0",
        "token1",
      ],
      optional: true,
    },
    maker: {
      type: "string",
      label: "Maker Address",
      description: "Filter events to a specific wallet address (the transaction initiator).",
      optional: true,
    },
    timestampFrom: {
      type: "integer",
      label: "Timestamp From (Unix)",
      description: "Start of the time window as a Unix timestamp in seconds.",
      optional: true,
    },
    timestampTo: {
      type: "integer",
      label: "Timestamp To (Unix)",
      description: "End of the time window as a Unix timestamp in seconds.",
      optional: true,
    },
    priceUsd: {
      type: "string",
      label: "Price USD Filter",
      description: "Filter events by token price in USD. Provide a JSON object with comparison operators: `gt`, `gte`, `lt`, `lte`. Example: `{\"gte\": 0.5, \"lte\": 2.0}`.",
      optional: true,
    },
    priceUsdTotal: {
      type: "string",
      label: "Total USD Value Filter",
      description: "Filter events by total trade value in USD. Provide a JSON object with comparison operators: `gt`, `gte`, `lt`, `lte`. Example: `{\"gt\": 1000}`.",
      optional: true,
    },
    priceBaseToken: {
      type: "string",
      label: "Price Base Token Filter",
      description: "Filter events by price denominated in the base token. Provide a JSON object with comparison operators: `gt`, `gte`, `lt`, `lte`. Example: `{\"gt\": 0.001}`.",
      optional: true,
    },
    amountNonLiquidityToken: {
      type: "string",
      label: "Token Amount Filter",
      description: "Filter events by the non-liquidity token amount. Provide a JSON object with comparison operators: `gt`, `gte`, `lt`, `lte`. Example: `{\"gte\": 100}`.",
      optional: true,
    },
    symbolType: {
      type: "string",
      label: "Symbol Type",
      description: "Filter by whether the address resolves to a token or pool symbol.",
      options: [
        "token",
        "pool",
      ],
      optional: true,
    },
    direction: {
      type: "string",
      label: "Direction",
      description: "Sort order for results. `DESC` returns the most recent events first (default); `ASC` returns oldest first.",
      options: [
        {
          label: "Newest first (DESC)",
          value: "DESC",
        },
        {
          label: "Oldest first (ASC)",
          value: "ASC",
        },
      ],
      optional: true,
      default: "DESC",
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
      query GetTokenEvents($query: EventsQueryInput!, $limit: Int, $cursor: String, $direction: RankingDirection) {
        getTokenEvents(query: $query, limit: $limit, cursor: $cursor, direction: $direction) {
          cursor
          items {
            address
            eventDisplayType
            eventType
            transactionHash
            blockNumber
            timestamp
            maker
            token0Address
            token1Address
            token0SwapValueUsd
            token1SwapValueUsd
          }
        }
      }
    `;

    const timestamp = (this.timestampFrom ?? this.timestampTo) != null
      ? {
        from: this.timestampFrom ?? undefined,
        to: this.timestampTo ?? undefined,
      }
      : undefined;

    const variables = {
      query: {
        address: this.address,
        networkId: this.networkId,
        eventType: this.eventType || undefined,
        eventDisplayType: this.eventDisplayType?.length
          ? this.eventDisplayType
          : undefined,
        quoteToken: this.quoteToken || undefined,
        maker: this.maker || undefined,
        timestamp,
        priceUsd: this.priceUsd
          ? JSON.parse(this.priceUsd)
          : undefined,
        priceUsdTotal: this.priceUsdTotal
          ? JSON.parse(this.priceUsdTotal)
          : undefined,
        priceBaseToken: this.priceBaseToken
          ? JSON.parse(this.priceBaseToken)
          : undefined,
        amountNonLiquidityToken: this.amountNonLiquidityToken
          ? JSON.parse(this.amountNonLiquidityToken)
          : undefined,
        symbolType: this.symbolType || undefined,
      },
      limit: this.limit,
      cursor: this.cursor || undefined,
      direction: this.direction || undefined,
    };

    const data = await this.app.makeRequest($, QUERY, variables);

    const result = data.getTokenEvents;
    const count = result.items?.length ?? 0;
    $.export("$summary", `Retrieved ${count} event(s) for ${this.address} on network ${this.networkId}`);
    return result;
  },
};
