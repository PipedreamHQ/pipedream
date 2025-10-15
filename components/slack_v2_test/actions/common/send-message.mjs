import slack from "../../slack_v2_test.app.mjs";

export default {
  props: {
    slack,
    as_user: {
      propDefinition: [
        slack,
        "as_user",
      ],
    },
    addToChannel: {
      propDefinition: [
        slack,
        "addToChannel",
      ],
      optional: true,
    },
    post_at: {
      propDefinition: [
        slack,
        "post_at",
      ],
    },
    include_sent_via_pipedream_flag: {
      type: "boolean",
      optional: true,
      default: true,
      label: "Include link to Pipedream",
      description: "Defaults to `true`, includes a link to Pipedream at the end of your Slack message.",
    },
    customizeBotSettings: {
      type: "boolean",
      label: "Customize Bot Settings",
      description: "Customize the username and/or icon of the Bot",
      optional: true,
      reloadProps: true,
    },
    username: {
      propDefinition: [
        slack,
        "username",
      ],
      hidden: true,
    },
    icon_emoji: {
      propDefinition: [
        slack,
        "icon_emoji",
      ],
      hidden: true,
    },
    icon_url: {
      propDefinition: [
        slack,
        "icon_url",
      ],
      hidden: true,
    },
    replyToThread: {
      type: "boolean",
      label: "Reply to Thread",
      description: "Reply to an existing thread",
      optional: true,
      reloadProps: true,
    },
    thread_ts: {
      propDefinition: [
        slack,
        "messageTs",
      ],
      description: "Provide another message's `ts` value to make this message a reply (e.g., if triggering on new Slack messages, enter `{{event.ts}}`). Avoid using a reply's `ts` value; use its parent instead. e.g. `1403051575.000407`.",
      optional: true,
      hidden: true,
    },
    thread_broadcast: {
      propDefinition: [
        slack,
        "thread_broadcast",
      ],
      hidden: true,
    },
    addMessageMetadata: {
      type: "boolean",
      label: "Add Message Metadata",
      description: "Set the metadata event type and payload",
      optional: true,
      reloadProps: true,
    },
    metadata_event_type: {
      propDefinition: [
        slack,
        "metadata_event_type",
      ],
      hidden: true,
    },
    metadata_event_payload: {
      propDefinition: [
        slack,
        "metadata_event_payload",
      ],
      hidden: true,
    },
    configureUnfurlSettings: {
      type: "boolean",
      label: "Configure Unfurl Settings",
      description: "Configure settings for unfurling links and media",
      optional: true,
      reloadProps: true,
    },
    unfurl_links: {
      propDefinition: [
        slack,
        "unfurl_links",
      ],
      hidden: true,
    },
    unfurl_media: {
      propDefinition: [
        slack,
        "unfurl_media",
      ],
      hidden: true,
    },
  },
  async additionalProps(props) {
    if (this.conversation && this.replyToThread) {
      props.thread_ts.hidden = false;
      props.thread_broadcast.hidden = false;
    }
    if (this.customizeBotSettings) {
      props.username.hidden = false;
      props.icon_emoji.hidden = false;
      props.icon_url.hidden = false;
    }
    if (this.addMessageMetadata) {
      props.metadata_event_type.hidden = false;
      props.metadata_event_payload.hidden = false;
    }
    if (this.configureUnfurlSettings) {
      props.unfurl_links.hidden = false;
      props.unfurl_media.hidden = false;
    }
    return {};
  },
  methods: {
    _makeSentViaPipedreamBlock() {
      const workflowId = process.env.PIPEDREAM_WORKFLOW_ID;
      const baseLink = "https://pipedream.com";
      const linkText = !workflowId
        ? "Pipedream Connect"
        : "Pipedream";

      const link = !workflowId
        ? `${baseLink}/connect`
        : `${baseLink}/@/${workflowId}?o=a&a=slack`;

      return {
        "type": "context",
        "elements": [
          {
            "type": "mrkdwn",
            "text": `Sent via <${link}|${linkText}>`,
          },
        ],
      };
    },
    _makeTextBlock(mrkdwn = true) {
      const { text } = this;
      let serializedText = text;
      // The Slack SDK expects the value of text's "text" property to be a string. If this.text is
      // anything other than string, number, or boolean, then encode it as a JSON string.
      if (typeof text !== "string" && typeof text !== "number" && typeof text !== "boolean") {
        serializedText = JSON.stringify(text);
      }
      return {
        "type": "section",
        "text": {
          "type": mrkdwn
            ? "mrkdwn"
            : "plain_text",
          "text": serializedText,
        },
      };
    },
    getChannelId() {
      return this.conversation ?? this.reply_channel;
    },
  },
  async run({ $ }) {
    const channelId = await this.getChannelId();
    let channel;

    if (this.addToChannel) {
      await this.slack.maybeAddAppToChannels([
        channelId,
      ]);
    } else if (!this.as_user) {
      channel = (await this.slack.checkAccessToChannel(channelId))?.channel;
    }

    let blocks = this.blocks;

    if (!blocks) {
      blocks = [
        this._makeTextBlock(this.mrkdwn),
      ];
    } else if (typeof blocks === "string") {
      blocks = JSON.parse(blocks);
    }

    if (this.include_sent_via_pipedream_flag) {
      const sentViaPipedreamText = this._makeSentViaPipedreamBlock();
      blocks.push(sentViaPipedreamText);
    }

    let metadataEventPayload;

    if (this.metadata_event_type) {

      if (typeof this.metadata_event_payload === "string") {
        try {
          metadataEventPayload = JSON.parse(this.metadata_event_payload);
        } catch (error) {
          throw new Error(`Invalid JSON in metadata_event_payload: ${error.message}`);
        }
      }

      this.metadata = {
        event_type: this.metadata_event_type,
        event_payload: metadataEventPayload,
      };
    }

    const obj = {
      text: this.text,
      channel: channelId,
      attachments: this.attachments,
      unfurl_links: this.unfurl_links,
      unfurl_media: this.unfurl_media,
      parse: this.parse,
      as_user: this.as_user,
      username: this.username,
      icon_emoji: this.icon_emoji,
      icon_url: this.icon_url,
      mrkdwn: this.mrkdwn,
      blocks,
      link_names: this.link_names,
      reply_broadcast: this.thread_broadcast,
      thread_ts: this.thread_ts,
      metadata: this.metadata || null,
    };

    if (this.post_at) {
      obj.post_at = Math.floor(new Date(this.post_at).getTime() / 1000);
      return await this.slack.scheduleMessage(obj);
    }
    const resp = await this.slack.postChatMessage(obj);
    channel ??= (await this.slack.conversationsInfo({
      channel: resp.channel,
    })).channel;
    const channelName = await this.slack.getChannelDisplayName(channel);
    $.export("$summary", `Successfully sent a message to ${channelName}`);
    return resp;
  },
};
