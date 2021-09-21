const slack = require("../../slack.app.js");

module.exports = {
  key: "slack-find-message",
  name: "Find Message",
  description: "Find a Slack message",
  version: "0.0.1",
  type: "action",
  props: {
    slack,
    query: {
      propDefinition: [
        slack,
        "query",
      ],
    },
    count: {
      propDefinition: [
        slack,
        "count",
      ],
      optional: true,
    },
    team_id: {
      propDefinition: [
        slack,
        "team_id",
      ],
      optional: true,
    },
  },
  async run() {
    return await this.slack.sdk().search.messages({
      query: this.query,
      count: this.count,
    });
  },
};
