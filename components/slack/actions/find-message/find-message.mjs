import slack from "../../slack.app.mjs";

export default {
  key: "slack-find-message",
  name: "Find Message",
  description: "Find a Slack message. [See the documentation](https://api.slack.com/methods/search.messages)",
  version: "0.0.27",
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
    teamId: {
      propDefinition: [
        slack,
        "team",
      ],
      optional: true,
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "The maximum number of messages to return",
      default: 100,
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
  async run({ $ }) {
    const matches = [];
    const params = {
      query: this.query,
      team_id: this.teamId,
      sort: this.sort,
      sort_dir: this.sortDirection,
      page: 1,
    };
    let hasMore;

    do {
      const { messages } = await this.slack.searchMessages(params);
      matches.push(...messages.matches);
      if (matches.length >= this.maxResults) {
        break;
      }
      hasMore = messages.matches?.length;
      params.page++;
    } while (hasMore);

    if (matches.length > this.maxResults) {
      matches.length = this.maxResults;
    }

    $.export("$summary", `Found ${matches.length} matching message${matches.length === 1
      ? ""
      : "s"}`);

    return matches;
  },
};
