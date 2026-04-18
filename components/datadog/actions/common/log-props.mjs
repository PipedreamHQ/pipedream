import datadog from "../../datadog.app.mjs";

export default {
  datadog,
  region: {
    propDefinition: [
      datadog,
      "region",
    ],
  },
  query: {
    type: "string",
    label: "Query",
    description:
      "Search query following"
      + " [log search syntax]"
      + "(https://docs.datadoghq.com/logs/search_syntax/)."
      + " E.g. `service:web-app status:error`",
    default: "*",
  },
  from: {
    type: "string",
    label: "From",
    description:
      "Minimum timestamp for requested logs."
      + " Supports date math (e.g. `now-15m`,"
      + " `now-24h`), ISO-8601, or epoch ms."
      + " Defaults to 15 minutes ago.",
    optional: true,
  },
  to: {
    type: "string",
    label: "To",
    description:
      "Maximum timestamp for requested logs."
      + " Supports date math (e.g. `now`),"
      + " ISO-8601, or epoch ms."
      + " Defaults to now.",
    optional: true,
  },
  indexes: {
    type: "string[]",
    label: "Indexes",
    description:
      "List of log index names to search."
      + " Defaults to all indexes.",
    optional: true,
  },
  limit: {
    type: "integer",
    label: "Max Results",
    description:
      "Maximum number of logs to return per page."
      + " Default `10`, max `1000`.",
    optional: true,
    min: 1,
    max: 1000,
  },
  sort: {
    type: "string",
    label: "Sort",
    description: "Sort order for results.",
    optional: true,
    options: [
      {
        label: "Timestamp descending (newest first)",
        value: "-timestamp",
      },
      {
        label: "Timestamp ascending (oldest first)",
        value: "timestamp",
      },
    ],
  },
};
