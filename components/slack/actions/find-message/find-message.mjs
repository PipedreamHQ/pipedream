import slack from "../../slack.app.mjs";

export default {
  key: "slack-find-message",
  name: "Find Message",
  description: "Find a Slack message. [See the documentation](https://api.slack.com/methods/search.messages)",
  version: "0.0.24",
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
  },
  async run({ $ }) {
    const matches = [];
    const params = {
      query: this.query,
      team_id: this.teamId,
      page: 1,
    };
    let hasMore;

    do {
      const { messages } = await this.slack.searchMessages(params);
      matches.push(...messages.matches);
      if (messages.length >= this.maxResults) {
        break;
      }
      hasMore = messages?.length;
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
