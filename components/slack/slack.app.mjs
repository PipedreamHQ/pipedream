import { axios } from "@pipedream/platform";
import { WebClient } from "@slack/web-api";
import slackApp from "../../slack.app.mjs";

export default {
  type: "app",
  app: "slack",
  propDefinitions: {
    ...slackApp.propDefinitions,
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
    channelId: {
      propDefinition: [
        slackApp,
        "channelId",
      ],
    },
    text: {
      propDefinition: [
        slackApp,
        "text",
      ],
    },
    blocks: {
      propDefinition: [
        slackApp,
        "blocks",
      ],
    },
  },
  methods: {
    ...slackApp.methods,
    sdk() {
      return new WebClient(this.$auth.oauth_access_token);
    },
    async sendMessageWithButtons({
      channel, text, blocks, thread_ts,
    }) {
      const timeout = this.approvalRequestTimeout * 60 * 1000; // Convert minutes to milliseconds
      const {
        resume_url, cancel_url,
      } = this.$.flow.suspend(timeout);

      // Append the buttons to the end of the existing blocks, if any
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

      if (blocks) {
        blocks = JSON.parse(blocks);
        blocks.push(...actionBlocks);
      } else {
        blocks = actionBlocks;
      }

      return this.sdk().chat.postMessage({
        channel,
        text,
        blocks,
        thread_ts,
      });
    },
  },
};
