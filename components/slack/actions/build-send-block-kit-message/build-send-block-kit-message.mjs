import common from "../common/send-message.mjs";
import buildBlocks from "../common/build-blocks.mjs";

export default {
  ...common,
  ...buildBlocks,
  name: "Build and Send a Block Kit Message (Beta)",
  description: "Configure custom blocks and send to a channel. [See Slack's docs for more info](https://api.slack.com/tools/block-kit-builder).",
  version: "0.0.1",
  type: "action",
  key: "slack-build-send-block-kit-message",
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
        "notificationText",
      ],
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
    async sendMessage() {
      const generatedBlocks = await this.getGeneratedBlocks();
      return await this.slack.sdk().chat.postMessage({
        channel: this.conversation,
        blocks: generatedBlocks,
        type: common.messageType,
      });
    },
  },
  async run({ $ }) {
    const resp = await this.sendMessage();
    $.export("$summary", "Successfully sent a block kit message with ts: " + resp.ts);
    return resp;
  },
};
