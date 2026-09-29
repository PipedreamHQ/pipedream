import { ConfigurationError } from "@pipedream/platform";
import slack from "../../slack_v2.app.mjs";

export default {
  props: {
    slack,
    as_user: {
      type: "boolean",
      label: "Send as User",
      // No hard default: an omitted value is resolved per-destination in
      // resolveAsUser() (DMs post as the authenticated user, channels as the
      // bot). A static default would make "omitted" indistinguishable from an
      // explicit choice in run().
      description: "Post as the authenticated user (`true`) rather than as the app's bot (`false`)."
        + " When omitted, **direct messages default to the authenticated user** so the Slack"
        + " notification is not prefixed with the `Pipedream:` bot name, while **channel messages"
        + " default to the bot**. Set explicitly to override.",
      optional: true,
    },
    addToChannel: {
      propDefinition: [
        slack,
        "addToChannel",
      ],
      description: "If `true`, the app will be added to the specified non-DM channel(s) automatically. If `false`, you must add the app to the channel manually to post to a private channel as a bot. Defaults to `false`.",
      default: false,
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
    username: {
      propDefinition: [
        slack,
        "username",
      ],
    },
    icon_emoji: {
      propDefinition: [
        slack,
        "icon_emoji",
      ],
    },
    icon_url: {
      propDefinition: [
        slack,
        "icon_url",
      ],
    },
    thread_ts: {
      propDefinition: [
        slack,
        "messageTs",
      ],
      description: "Provide another message's `ts` value to make this message a reply (e.g., if triggering on new Slack messages, enter `{{event.ts}}`). Avoid using a reply's `ts` value; use its parent instead. e.g. `1403051575.000407`.",
      optional: true,
    },
    thread_broadcast: {
      propDefinition: [
        slack,
        "thread_broadcast",
      ],
    },
    metadata_event_type: {
      propDefinition: [
        slack,
        "metadata_event_type",
      ],
    },
    metadata_event_payload: {
      propDefinition: [
        slack,
        "metadata_event_payload",
      ],
    },
    unfurl_links: {
      propDefinition: [
        slack,
        "unfurl_links",
      ],
    },
    unfurl_media: {
      propDefinition: [
        slack,
        "unfurl_media",
      ],
    },
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
    async isDirectMessageTarget(destination) {
      if (!destination) return false;
      const value = String(destination)
        .trim()
        .replace(/^@/, "");
      // Slack ids are uppercase, so match case-sensitively (a lowercased all-alnum
      // channel name must not read as an id). User ids (U…/W…) and open IM ids (D…)
      // address a direct message; a public/private channel id (C…) and a channel
      // name do not.
      if (/^[UWD][A-Z0-9]{6,}$/.test(value)) return true;
      if (/^C[A-Z0-9]{6,}$/.test(value)) return false;
      // A `G…` id is ambiguous: a legacy private group (a channel) OR a
      // multi-person DM (mpim), which IS a direct message. Resolve the type so a
      // group DM also defaults to the authenticated user (prefix-free) rather than
      // the bot. Fall back to bot-default (channel) if it can't be classified.
      if (/^G[A-Z0-9]{6,}$/.test(value)) {
        try {
          const { channel } = await this.slack.conversationsInfo({
            channel: value,
          });
          return Boolean(channel?.is_im || channel?.is_mpim);
        } catch {
          return false;
        }
      }
      // Anything else (a channel name) is a channel.
      return false;
    },
    async resolveAsUser(destination) {
      // An explicit choice always wins.
      if (this.as_user !== undefined) {
        return this.as_user;
      }
      // A custom bot identity is an implicit request to post as the bot, so honor
      // it (post as the bot with that identity) instead of defaulting a DM to the
      // authenticated user and then erroring in assertBotIdentityCompatible. This
      // preserves a pre-existing "DM as the bot with a custom username/icon" config.
      if (this.username || this.icon_emoji || this.icon_url) {
        return false;
      }
      // Otherwise default per destination: DMs (including group DMs) post as the
      // authenticated user (prefix-free), channels post as the bot.
      return this.isDirectMessageTarget(destination);
    },
    assertBotIdentityCompatible(asUser) {
      // Slack only applies a custom username/icon when posting as the bot (as_user: false).
      // When posting as the authenticated user these settings are silently dropped, so surface
      // the conflict as a ConfigurationError instead of quietly ignoring the configuration.
      const identityProps = {
        username: "Bot Username",
        icon_emoji: "Icon (emoji)",
        icon_url: "Icon (URL)",
      };
      const setProps = Object.keys(identityProps)
        .filter((prop) => this[prop] !== undefined && this[prop] !== "");
      if (asUser && setProps.length) {
        const labels = setProps.map((prop) => identityProps[prop]).join(", ");
        throw new ConfigurationError(
          `Slack ignores custom bot identity (${labels}) when posting as the authenticated user. `
          + `Set **Send as User** to \`false\` to post as the bot with your custom ${setProps.length > 1
            ? "settings"
            : "setting"}, or clear ${setProps.length > 1
            ? "them"
            : "it"} to post as the authenticated user.`,
        );
      }
    },
  },
  async run({ $ }) {
    const channelId = await this.getChannelId();
    const asUser = await this.resolveAsUser(channelId);
    this.assertBotIdentityCompatible(asUser);

    if (this.addToChannel) {
      await this.slack.maybeAddAppToChannels([
        channelId,
      ]);
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
          throw new ConfigurationError(`Invalid JSON in metadata_event_payload: ${error.message}`);
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
      as_user: asUser,
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
      const result = await this.slack.scheduleMessage(obj);
      $.export("$summary", `Message scheduled for ${this.post_at}`);
      return result;
    }
    const resp = await this.slack.postChatMessage(obj);
    const { channel } = await this.slack.conversationsInfo({
      channel: resp.channel,
    });
    const channelName = await this.slack.getChannelDisplayName(channel);
    $.export("$summary", `Successfully sent a message to ${channelName}`);
    return resp;
  },
};
