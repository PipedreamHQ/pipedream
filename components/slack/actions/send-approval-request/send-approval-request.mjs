import slack from "../../slack.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "slack-send-approval-request",
  name: "Send Approval Request",
  description: "Sends a Slack message with approval and cancel buttons using block elements. [See the documentation](https://api.slack.com/methods/chat.postMessage)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    slack,
    channelId: {
      propDefinition: [
        slack,
        "channelId",
      ],
    },
    text: {
      propDefinition: [
        slack,
        "text",
      ],
    },
    blocks: {
      propDefinition: [
        slack,
        "blocks",
      ],
    },
    resumeExecutionButtonText: {
      propDefinition: [
        slack,
        "resumeExecutionButtonText",
      ],
    },
    cancelExecutionButtonText: {
      propDefinition: [
        slack,
        "cancelExecutionButtonText",
      ],
    },
    approvalRequestTimeout: {
      propDefinition: [
        slack,
        "approvalRequestTimeout",
      ],
    },
  },
  async run({ $ }) {
    const timeout = this.approvalRequestTimeout * 60 * 1000; // Convert minutes to milliseconds
    const {
      resume_url, cancel_url,
    } = $.flow.suspend(timeout);

    let blocksArray = this.blocks
      ? JSON.parse(this.blocks)
      : [];

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
