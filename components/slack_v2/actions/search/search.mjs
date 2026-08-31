// x-pd-ai: optimized
import utils from "../../common/utils.mjs";
import slack from "../../slack_v2.app.mjs";

export default {
  key: "slack_v2-search",
  name: "Search",
  description:
    "Search Slack messages and files using the Real-Time Search API."
    + " Supports keyword and semantic search across public and private channels."
    + " Use **Get User Details** first to find your user ID for filtering by 'my' messages."
    + " Returns matching messages with channel context, timestamps, and permalinks."
    + " User mentions come back in the canonical `<@U123>` form; echo it verbatim to post a real mention."
    + " Display names are returned separately as `mentions`, an array of `{ id, name }` objects,"
    + " omitted when no mention carried a name."
    + " Do NOT splice a name back inline: Slack renders `<@U123|Name>` as literal text, not a mention."
    + " [See the documentation](https://api.slack.com/methods/assistant.search.context)",
  version: "0.1.0",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    slack,
    query: {
      type: "string",
      label: "Query",
      description: "The search query. Supports Slack search syntax — e.g. `from:@user`, `in:#channel`, `before:2025-01-01`.",
    },
    channelTypes: {
      type: "string",
      label: "Channel Types",
      description: "Comma-separated channel types to search. Default: `public_channel,private_channel`.",
      default: "public_channel,private_channel",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Max Results",
      description: "Maximum number of results to return.",
      default: 20,
      optional: true,
    },
  },
  async run({ $ }) {
    const maxResults = Math.max(this.limit ?? 20, 1);
    const matches = [];
    let cursor;

    do {
      const response = await this.slack.assistantSearch({
        query: this.query,
        channel_types: this.channelTypes,
        cursor,
      });
      matches.push(...(response.results?.messages || []));
      cursor = response.response_metadata?.next_cursor;
    } while (cursor && matches.length < maxResults);

    const results = utils.normalizeSearchMessages(matches.slice(0, maxResults));

    $.export("$summary", `Found ${results.length} result${results.length === 1
      ? ""
      : "s"} for "${this.query}"`);

    return results;
  },
};
