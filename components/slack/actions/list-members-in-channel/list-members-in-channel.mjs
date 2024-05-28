import slack from "../../slack.app.mjs";

export default {
  key: "slack-list-members-in-channel",
  name: "List Members in Channel",
  description: "Retrieve members of a channel. [See docs here](https://api.slack.com/methods/conversations.members)",
  version: "0.0.16",
  type: "action",
  props: {
    slack,
    conversation: {
      propDefinition: [
        slack,
        "conversation",
      ],
    },
    returnUsernames: {
      type: "boolean",
      label: "Return Usernames",
      description: "Optionally, return usernames in addition to IDs",
      optional: true,
    },
  },
  async run() {
    const { members } = await this.slack.sdk().conversations.members({
      channel: this.conversation,
    });
    let channelMembers = members;
    if (this.returnUsernames) {
      const usernames = await this.slack.userNames();
      channelMembers = channelMembers?.map((id) => ({
        id,
        username: usernames[id],
      })) || [];
    }
    return channelMembers;
  },
};
