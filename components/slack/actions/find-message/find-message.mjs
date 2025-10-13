import { axios } from "@pipedream/platform";
import slack from "../../slack.app.mjs";

export default {
  key: "slack-find-message",
  name: "Find Message",
  description: "Find a Slack message. [See the documentation](https://api.slack.com/methods/assistant.search.context)",
  version: "0.0.26",
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
      description: "Sort ascending (asc) or descending (desc)`",
      options: [
        "desc",
        "asc",
      ],
      optional: true,
    },
  },
  methods: {
    async searchMessages($, params) {
      const data = await axios($, {
        method: "POST",
        url: "https://slack.com/api/assistant.search.context",
        data: {
          query: params.query,
          sort: params.sort,
          sort_dir: params.sort_dir,
          cursor: params.cursor,
          channel_types: params.channel_types,
        },
        headers: {
          "Authorization": `Bearer ${this.slack.getToken()}`,
          "Content-Type": "application/json",
        },
      });
      if (!data.ok) {
        throw new Error(data.error || "An error occurred while searching messages");
      }
      return data;
    },
  },
  async run({ $ }) {
    const matches = [];
    const params = {
      query: this.query,
      sort: this.sort,
      sort_dir: this.sortDirection,
      channel_types: "public_channel,private_channel",
    };
    let cursor;

    do {
      if (cursor) {
        params.cursor = cursor;
      }
      const response = await this.searchMessages($, params);
      const messages = response.results?.messages || [];
      matches.push(...messages);
      if (matches.length >= this.maxResults) {
        break;
      }
      cursor = response.response_metadata?.next_cursor;
    } while (cursor);

    if (matches.length > this.maxResults) {
      matches.length = this.maxResults;
    }

    $.export("$summary", `Found ${matches.length} matching message${matches.length === 1
      ? ""
      : "s"}`);

    return matches;
  },
};
