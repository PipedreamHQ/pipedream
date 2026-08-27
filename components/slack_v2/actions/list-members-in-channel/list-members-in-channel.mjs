import slack from "../../slack_v2.app.mjs";

export default {
  key: "slack_v2-list-members-in-channel",
  name: "List Members in Channel",
  description: "Retrieve members of a channel. Accepts a channel ID or NAME (e.g. general or #general) — names are resolved automatically. [See the documentation](https://api.slack.com/methods/conversations.members)",
  version: "0.1.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
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
      description: "Optionally, return usernames in addition to IDs. The username may be `null` for members whose name cannot be resolved, such as external (Slack Connect) users.",
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
    // Accept a channel NAME as well as an ID. Every AI-optimized tool in this app resolves
    // names server-side, so an agent that read "#seinfeld-general" from the prompt
    // reasonably passes it here too — and used to get channel_not_found.
    const channel = await this.slack.resolveChannelId(this.conversation);
    const params = {
      channel,
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
        username: usernames[id] ?? null,
      })) || [];
    }

    $.export("$summary", `Successfully retrieved ${channelMembers.length} member${channelMembers.length === 1
      ? ""
      : "s"}`);
    return channelMembers;
  },
};
