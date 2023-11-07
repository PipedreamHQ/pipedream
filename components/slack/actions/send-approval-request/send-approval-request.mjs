import common from "../common/send-message.mjs";
import buildApprovalButtons from "../common/build-blocks.mjs";

export default {
  ...common,
  ...buildApprovalButtons,
  name: "Send Approval Request",
  version: "0.0.1",
  key: "request-approval",
  type: "action",
  description: "Send an approval request in Slack to continue or cancel workflow execution, using `$.flow.suspend()`.",
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
    blocks: {
      propDefinition: [
        common.props.slack,
        "blocks",
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
    // ...common.props,
  },
  methods: {
    ...common.methods,
  },
  async run() {

  },
};
