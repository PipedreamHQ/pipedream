import slack from "../../slack.app.mjs";

export default {
  key: "slack-list-members-in-channel",
  name: "List Members in Channel",
  description: "Retrieve members of a channel. [See the documentation](https://api.slack.com/methods/conversations.members)",
  version: "0.0.23",
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
    pageSize: {
      propDefinition: [
        slack,
        "pageSize",
      ],
    },
    numPages: {
      propDefinition: [
        slack,
        "numPages",
      ],
    },
  },
  async run({ $ }) {
    let channelMembers = [];
    const params = {
      channel: this.conversation,
      limit: this.pageSize,
    };
    let page = 0;

    do {
      const {
        members, response_metadata: { next_cursor: nextCursor },
      } = await this.slack.listChannelMembers(params);
      channelMembers.push(...members);
      params.cursor = nextCursor;
      page++;
    } while (params.cursor && page < this.numPages);

    if (this.returnUsernames) {
      const usernames = await this.slack.userNameLookup(channelMembers);
      channelMembers = channelMembers?.map((id) => ({
        id,
        username: usernames[id],
      })) || [];
    }

    $.export("$summary", `Successfully retrieved ${channelMembers.length} member${channelMembers.length === 1
      ? ""
      : "s"}`);
    return channelMembers;
  },
};
