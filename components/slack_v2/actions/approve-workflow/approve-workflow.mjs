import slack from "../../slack_v2.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "slack_v2-approve-workflow",
  name: "Approve Workflow",
  description: "Suspend the workflow until approved by a Slack message. [See the documentation](https://pipedream.com/docs/code/nodejs/rerun#flowsuspend)",
  version: "0.0.7",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    slack,
    channelType: {
      type: "string",
      label: "Channel Type",
      description: "The type of channel to send to. User/Direct Message (im), Group (mpim), Private Channel or Public Channel",
      async options() {
        return constants.CHANNEL_TYPE_OPTIONS;
      },
    },
    conversation: {
      propDefinition: [
        slack,
        "conversation",
        (c) => ({
          types: c.channelType === "Channels"
            ? [
              constants.CHANNEL_TYPE.PUBLIC,
              constants.CHANNEL_TYPE.PRIVATE,
            ]
            : [
              c.channelType,
            ],
        }),
      ],
    },
    message: {
      type: "string",
      label: "Message",
      description: "Text to include with the Approve and Cancel Buttons",
    },
  },
  async run({ $ }) {
    const {
      resume_url, cancel_url,
    } = $.flow.suspend();

    const response = await this.slack.postChatMessage({
      text: "Click here to approve or cancel workflow",
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: this.message,
          },
        },
        {
          type: "actions",
          elements: [
            {
              type: "button",
              text: {
                type: "plain_text",
                text: "Approve",
              },
              style: "primary",
              url: resume_url,
            },
            {
              type: "button",
              text: {
                type: "plain_text",
                text: "Cancel",
              },
              style: "danger",
              url: cancel_url,
            },
          ],
        },
      ],
      channel: this.conversation,
    });

    $.export("$summary", "Successfully sent message");
    return response;
  },
};
