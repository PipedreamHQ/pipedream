import common from "../common/send-message.mjs";
import buildBlocks from "../common/build-blocks.mjs";

export default {
  ...common,
  ...buildBlocks,
  name: "Build and Send a Block Kit Message (Beta)",
  description: "Configure custom blocks and send to a channel, group, or user. [See Slack's docs for more info](https://api.slack.com/tools/block-kit-builder).",
  version: "0.3.0",
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
  },
  async run({ $ }) {
    this.blocks = await this.getGeneratedBlocks();  // set the blocks prop for common.run to use
    const resp = await common.run.call(this, {
      $,
    });  // call common.run with the current context
    return resp;
  },
};
