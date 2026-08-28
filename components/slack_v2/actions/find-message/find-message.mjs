// x-pd-ai: optimized
import utils from "../../common/utils.mjs";
import slack from "../../slack_v2.app.mjs";

export default {
  key: "slack_v2-find-message",
  name: "Find Message",
  description: "Find a Slack message."
    + " User mentions come back as `<@U123>`,"
    + " any display names Slack supplied are returned separately in each result's `mentions`."
    + " [See the documentation](https://api.slack.com/methods/assistant.search.context)",
  version: "0.2.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    slack,
    query: {
      propDefinition: [
        slack,
        "query",
      ],
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "The maximum number of messages to return",
      default: 20,
      optional: true,
    },
    sort: {
      type: "string",
      label: "Sort",
      description: "Return matches sorted by either `score` or `timestamp`",
      options: [
        "score",
        "timestamp",
      ],
      optional: true,
    },
    sortDirection: {
      type: "string",
      label: "Sort Direction",
      description: "Sort ascending (asc) or descending (desc)",
      options: [
        "desc",
        "asc",
      ],
      optional: true,
    },
  },
  methods: {
    async searchWithAssistant(baseParams, maxResults) {
      const matches = [];
      let cursor;

      do {
        const response = await this.slack.assistantSearch({
          ...baseParams,
          channel_types: "public_channel,private_channel",
          cursor,
        });
        matches.push(...response.results?.messages || []);
        cursor = response.response_metadata?.next_cursor;
      } while (cursor && matches.length < maxResults);

      return utils.normalizeSearchMessages(matches.slice(0, maxResults));
    },
  },
  async run({ $ }) {
    const maxResults = Math.max(this.maxResults ?? 20, 1);
    const baseParams = {
      query: this.query,
      sort: this.sort,
      sort_dir: this.sortDirection,
    };
    const matches = await this.searchWithAssistant(baseParams, maxResults);

    $.export("$summary", `Found ${matches.length} matching message${matches.length === 1
      ? ""
      : "s"}`);

    return matches;
  },
};
