import common from "../send-message-common.mjs";

export default {
  ...common,
  key: "slack-send-custom-message",
  name: "Send a Custom Message",
  description: "Customize advanced setttings and send a message to a channel, group or user",
  version: "0.2.1",
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
    attachments: {
      propDefinition: [
        common.props.slack,
        "attachments",
      ],
    },
    unfurl_links: {
      propDefinition: [
        common.props.slack,
        "unfurl_links",
      ],
    },
    unfurl_media: {
      propDefinition: [
        common.props.slack,
        "unfurl_media",
      ],
    },
    parse: {
      propDefinition: [
        common.props.slack,
        "parse",
      ],
    },
    mrkdwn: {
      propDefinition: [
        common.props.slack,
        "mrkdwn",
      ],
    },
    blocks: {
      propDefinition: [
        common.props.slack,
        "blocks",
      ],
    },
    link_names: {
      propDefinition: [
        common.props.slack,
        "link_names",
      ],
    },
    reply_broadcast: {
      propDefinition: [
        common.props.slack,
        "reply_broadcast",
      ],
    },
    thread_ts: {
      propDefinition: [
        common.props.slack,
        "thread_ts",
      ],
    },
  },
};
