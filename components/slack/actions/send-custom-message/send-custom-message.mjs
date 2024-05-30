import common from "../common/send-message.mjs";
import buildBlocks from "../common/build-blocks.mjs";

export default {
  ...common,
  ...buildBlocks,
  key: "slack-send-custom-message",
  name: "Send a Custom Message",
  description: "Customize advanced setttings and send a message to a channel, group or user. See [postMessage](https://api.slack.com/methods/chat.postMessage) or [scheduleMessage](https://api.slack.com/methods/chat.scheduleMessage) docs here",
  version: "0.2.20",
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
      description: "If you're using `blocks`, this is used as a fallback string to display in notifications. If you aren't, this is the main body text of the message. It can be formatted as plain text, or with mrkdwn.",
    },
    mrkdwn: {
      propDefinition: [
        common.props.slack,
        "mrkdwn",
      ],
    },
    attachments: {
      propDefinition: [
        common.props.slack,
        "attachments",
      ],
    },
    parse: {
      propDefinition: [
        common.props.slack,
        "parse",
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
        "messageTs",
        (c) => ({
          channel: c.conversation,
        }),
      ],
      description: "Provide another message's `ts` value to make this message a reply (e.g., if triggering on new Slack messages, enter `{{event.ts}}`). Avoid using a reply's `ts` value; use its parent instead.",
      optional: true,
    },
    ...common.props,
    ...buildBlocks.props,
  },
  methods: {
    ...common.methods,
    ...buildBlocks.methods,
    async getGeneratedBlocks() {
      return await buildBlocks.run.call(this);  // call buildBlocks.run with the current context
    },
  },
  async run({ $ }) {
    if (this.passArrayOrConfigure) {
      this.blocks = await this.getGeneratedBlocks();  // set the blocks prop for common.run to use
    }
    const resp = await common.run.call(this, {
      $,
    });  // call common.run with the current context
    return resp;
  },
};
