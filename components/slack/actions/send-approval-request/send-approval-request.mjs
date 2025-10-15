import common from "../common/send-message.mjs";

export default {
  ...common,
  key: "slack-send-approval-request",
  name: "Send Approval Request",
  description: "Sends a Slack message with approval and cancel buttons using block elements. [See the documentation](https://api.slack.com/methods/chat.postMessage)",
  version: "0.0.{{ts}}",
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
    resumeExecutionButtonText: {
      type: "string",
      label: "Approval Button Text",
      description: "Text to display on the approval button",
      default: "Yes",
    },
    cancelExecutionButtonText: {
      type: "string",
      label: "Cancellation Button Text",
      description: "Text to display on the cancellation button",
      default: "No",
    },
    approvalRequestTimeout: {
      type: "integer",
      label: "Approval Request Timeout",
      description: "Time in minutes to wait for approval. After the request times out, workflow execution will cancel.",
      default: 60,
      optional: true,
    },
    ...common.props,
  },
  async run({ $ }) {
    const timeout = this.approvalRequestTimeout * 60 * 1000; // Convert minutes to milliseconds
    const {
      resume_url, cancel_url,
    } = $.flow.suspend(timeout);

    let blocksArray = this.blocks
      ? JSON.parse(this.blocks)
      : [];

    // Convert the text prop to a block format
    if (this.text) {
      const textBlock = {
        type: "section",
        text: {
          type: "mrkdwn",
          text: this.text,
        },
      };
      // Insert the text block at the start of the blocks array
      blocksArray.unshift(textBlock);
    }

    // Append the buttons to the end of the existing blocks
    const actionBlocks = [
      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: {
              type: "plain_text",
              text: this.resumeExecutionButtonText,
              emoji: true,
            },
            url: resume_url,
            action_id: "resume_execution",
            style: "primary",
          },
          {
            type: "button",
            text: {
              type: "plain_text",
              text: this.cancelExecutionButtonText,
              emoji: true,
            },
            url: cancel_url,
            action_id: "cancel_execution",
            style: "danger",
          },
        ],
      },
    ];

    blocksArray.push(...actionBlocks);

    const response = await this.slack.sdk().chat.postMessage({
      channel: this.channelId,
      text: this.text,
      blocks: blocksArray,
    });

    $.export("$summary", `Sent approval request message to channel ID ${response.channel}`);
    return response;
  },
};
