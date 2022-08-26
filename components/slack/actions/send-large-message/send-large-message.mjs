import common from "../common/send-message.mjs";

export default {
  ...common,
  key: "slack-send-large-message",
  name: "Send a Large Message (3000+ characters)",
  description: "Send a large message (more than 3000 characters) to a channel, group or user. See [postMessage](https://api.slack.com/methods/chat.postMessage) or [scheduleMessage](https://api.slack.com/methods/chat.scheduleMessage) docs here",
  version: "0.0.2",
  type: "action",
  props: {
    ...common.props,
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
    username: {
      propDefinition: [
        common.props.slack,
        "username",
      ],
      description: "Optionally customize your bot's username (default is `Pipedream`).",
    },
    icon_emoji: {
      propDefinition: [
        common.props.slack,
        "icon_emoji",
      ],
      description: "Optionally use an emoji as the bot icon for this message (e.g., `:fire:`). This value overrides `icon_url` if both are provided.",
    },
    icon_url: {
      propDefinition: [
        common.props.slack,
        "icon_url",
      ],
      description: "Optionally provide an image URL to use as the bot icon for this message.",
    },
  },
  async run() {
    if (this.include_sent_via_pipedream_flag) {
      const sentViaPipedreamText = this._makeSentViaPipedreamBlock();
      this.text += `\n\n--\n${sentViaPipedreamText.elements[0].text}`;
    }

    let metadataEventPayload;

    if (this.metadata_event_type) {
      try {
        metadataEventPayload = JSON.parse(this.metadata_event_payload);
      } catch (error) {
        throw new Error(`Invalid JSON in metadata_event_payload: ${error.message}`);
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
    };

    if (this.post_at) {
      obj.post_at = this.post_at;
      return this.slack.sdk().chat.scheduleMessage(obj);
    }

    return this.slack.sdk().chat.postMessage(obj);
  },
};
