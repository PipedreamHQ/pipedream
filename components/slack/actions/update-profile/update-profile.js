const slack = require("../../slack.app.js");
const { WebClient } = require("@slack/web-api");

module.exports = {
  key: "slack-update-profile",
  name: "Update Profile",
  description: "Update basic profile field such as name or title.",
  version: "0.0.2",
  type: "action",
  props: {
    slack,
    name: {
      propDefinition: [
        slack,
        "name",
      ],
    },
    value: {
      propDefinition: [
        slack,
        "value",
      ],
    },
  },
  async run() {
    const web = new WebClient(this.slack.$auth.oauth_access_token);
    return await web.users.profile.set({
      name: this.name,
      value: this.value,
    });
  },
};
