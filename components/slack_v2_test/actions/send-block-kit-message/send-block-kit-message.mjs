import buildBlocks from "../common/build-blocks.mjs";
import common from "../common/send-message.mjs";

export default {
  ...common,
  ...buildBlocks,
  key: "slack_v2_test-send-block-kit-message",
  name: "Build and Send a Block Kit Message",
  description: "Configure custom blocks and send to a channel, group, or user. [See the documentation](https://api.slack.com/tools/block-kit-builder).",
  version: "0.5.3",
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
      type: "string",
      label: "Notification Text",
      description: "Optionally provide a string for Slack to display as the new message notification (if you do not provide this, notification will be blank).",
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
    this.blocks = await this.getGeneratedBlocks();  // set the blocks prop for common.run to use
    const resp = await common.run.call(this, {
      $,
    });  // call common.run with the current context
    return resp;
  },
};
