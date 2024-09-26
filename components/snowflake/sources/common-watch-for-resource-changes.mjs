import common from "./common.mjs";

export default {
  ...common,
  props: {
    ...common.props,
    timer: {
      description: "Watch for changes on this schedule. Snowflake query history has roughly a 45 minute delay",
      type: "$.interface.timer",
      default: {
        // Snowflake updates query history once every 45 minutes,
        // so Snowflake recommends customers poll the table no more than once an hour.
        intervalSeconds: 60 * 60,
      },
    },
    queryTypes: {
      type: "string[]",
      label: "Query Types",
      description: "**Optional**. The type of queries to watch for. If not provided, changes will be emitted for all query types.",
      options: [
        "CREATE",
        "ALTER",
        "DROP",
      ],
      default: [
        "CREATE",
        "ALTER",
        "DROP",
      ],
      optional: true,
    },
  },
};
