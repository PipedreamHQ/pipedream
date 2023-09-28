import common from "../common/send-message.mjs";
import buildBlocks from "../common/build-blocks.mjs";

export default {
  ...common,
  ...buildBlocks,
  name: "Build and Send a Block Kit Message",
  description: "Configure custom blocks and send to a channel. [See Slack's docs for more info](https://api.slack.com/tools/block-kit-builder).",
  version: "0.0.1",
  type: "action",
  key: "slack-send-block-kit-message",
  props: {
    slack: common.props.slack,
    conversation: {
      propDefinition: [
        common.props.slack,
        "conversation",
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
  async run() {
    const acknowledgment = await this.sendMessage();
    return acknowledgment;
  },
};
