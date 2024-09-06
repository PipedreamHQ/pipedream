import slack from "../../slack.app.mjs";

export default {
  key: "slack-list-channels",
  name: "List Channels",
  description: "Return a list of all channels in a workspace. [See the documentation](https://api.slack.com/methods/conversations.list)",
  version: "0.0.19",
  type: "action",
  props: {
    slack,
  },
  async run({ $ }) {
    const response = await this.slack.sdk().conversations.list();
    $.export("$summary", `Successfully found ${response.length} channel${response.length === 1
      ? ""
      : "s"}`);
    return response;
  },
};
