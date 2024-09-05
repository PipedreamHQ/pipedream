import slack from "../../slack.app.mjs";

export default {
  key: "slack-find-message",
  name: "Find Message",
  description: "Find a Slack message. [See the documentation](https://api.slack.com/methods/search.messages)",
  version: "0.0.19",
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
      hasMore = messages?.length;
      params.page++;
    } while (hasMore);

    $.export("$summary", `Found ${matches.length} matching message${matches.length === 1
      ? ""
      : "s"}`);

    return matches;
  },
};
