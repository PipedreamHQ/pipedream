import slack from "../../slack_v2.app.mjs";

export default {
  key: "slack_v2-list-channels",
  name: "List Channels",
  description: "Return a list of all channels in a workspace. [See the documentation](https://api.slack.com/methods/conversations.list)",
  version: "0.1.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    slack,
    channelTypes: {
      type: "string",
      label: "Channel Types",
      description: "The types of channels to list. Select `public` for public channels only, `private` for private channels only, or `all` for both public and private channels.",
      options: [
        {
          label: "Public Channels",
          value: "public_channel",
        },
        {
          label: "Private Channels",
          value: "private_channel",
        },
        {
          label: "All (Public + Private)",
          value: "public_channel,private_channel",
        },
      ],
      default: "public_channel",
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
    const allChannels = [];
    const params = {
      limit: this.pageSize,
      types: this.channelTypes,
    };
    let page = 0;

    do {
      const {
        channels, response_metadata: { next_cursor: nextCursor },
      } = await this.slack.conversationsList(params);
      allChannels.push(...channels);
      params.cursor = nextCursor;
      page++;
    } while (params.cursor && page < this.numPages);

    $.export("$summary", `Successfully found ${allChannels.length} channel${allChannels.length === 1
      ? ""
      : "s"}`);
    return {
      channels: allChannels,
    };
  },
};
