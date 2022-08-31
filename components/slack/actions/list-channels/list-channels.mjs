import slack from "../../slack.app.mjs";

export default {
  key: "slack-list-channels",
  name: "List Channels",
  description: "Return a list of all channels in a workspace. [See docs here](https://api.slack.com/methods/conversations.list)",
  version: "0.0.5",
  type: "action",
  props: {
    slack,
  },
  async run() {
    return await this.slack.sdk().conversations.list();
  },
};
