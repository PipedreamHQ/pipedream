import common from "../common/send-message.mjs";

export default {
  ...common,
  key: "slack_v2-send-large-message",
  name: "Send a Large Message (3000+ characters)",
  description: "Send a large message (more than 3000 characters) to a channel, group or user. See [postMessage](https://api.slack.com/methods/chat.postMessage) or [scheduleMessage](https://api.slack.com/methods/chat.scheduleMessage) docs here",
  version: "0.1.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    slack: common.props.slack,
    conversation: {
      propDefinition: [
        common.props.slack,
        "conversation",
      ],
    },
    text: {
      propDefinition: [
        common.props.slack,
        "text",
      ],
    },
    mrkdwn: {
      propDefinition: [
        common.props.slack,
        "mrkdwn",
      ],
    },
    ...common.props,
  },
  async run({ $ }) {
    if (this.addToChannel) {
      await this.slack.maybeAddAppToChannels([
        this.conversation,
      ]);
    }

    if (this.include_sent_via_pipedream_flag) {
      const sentViaPipedreamText = this._makeSentViaPipedreamBlock();
      this.text += `\n\n\n${sentViaPipedreamText.elements[0].text}`;
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
      channel: this.conversation,
      as_user: this.as_user,
      username: this.username,
      icon_emoji: this.icon_emoji,
      icon_url: this.icon_url,
      mrkdwn: this.mrkdwn,
      metadata: this.metadata || null,
      reply_broadcast: this.thread_broadcast,
      thread_ts: this.thread_ts,
      unfurl_links: this.unfurl_links,
      unfurl_media: this.unfurl_media,
    };

    let response;
    if (this.post_at) {
      obj.post_at = this.post_at;
      response = await this.slack.scheduleMessage(obj);
    } else {
      response = await this.slack.postChatMessage(obj);
    }
    const { channel } = await this.slack.conversationsInfo({
      channel: response.channel,
    });
    const channelName = await this.slack.getChannelDisplayName(channel);
    $.export("$summary", `Successfully sent a message to ${channelName}`);
    return response;
  },
};
