const slack = require("../../slack.app.js");

module.exports = {
  key: "slack-send-message-public-channel",
  name: "Send Message to a Public Channel",
  description: "Send a message to a public channel and customize the name and avatar of the bot that posts the message",
  version: "0.1.0",
  type: "action",
  props: {
    slack,
    conversation: {
      propDefinition: [
        slack,
        "publicChannel",
      ],
    },
    text: {
      propDefinition: [
        slack,
        "text",
      ],
    },
    as_user: {
      propDefinition: [
        slack,
        "as_user",
      ],
    },
    username: {
      propDefinition: [
        slack,
        "username",
      ],
      description: "Optionally customize your bot's username (default is `Pipedream`).",
    },
    icon_emoji: {
      propDefinition: [
        slack,
        "icon_emoji",
      ],
      description: "Optionally use an emoji as the bot icon for this message (e.g., `:fire:`). This value overrides `icon_url` if both are provided.",
    },
    icon_url: {
      propDefinition: [
        slack,
        "icon_url",
      ],
      description: "Optionally provide an image URL to use as the bot icon for this message.",
    },
    include_sent_via_pipedream_flag: {
      type: "boolean",
      optional: true,
      default: true,
      label: "Include link to workflow",
      description: "Defaults to `true`. This will include a link to the workflow at the end of your Slack message.",
    },
  },
  async run() {
    let link = `https://pipedream.com/@/${process.env.PIPEDREAM_WORKFLOW_ID}`;
    link += `/inspect/${process.env.PIPEDREAM_TRACE_ID}`;
    link += "?origin=action";
    link += "&a=slack";
    if (this.include_sent_via_pipedream_flag == true) {
      this.blocks = [
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": this.text,
          },
        },
        {
          "type": "context",
          "elements": [
            {
              "type": "mrkdwn",
              "text": `Sent via <${link}|Pipedream>`,
            },
          ],
        },
      ];
    }
    return await this.slack.sdk().chat.postMessage({
      channel: this.conversation,
      text: this.text,
      blocks: this.blocks,
      as_user: this.as_user,
      username: this.username,
      icon_emoji: this.icon_emoji,
      icon_url: this.icon_url,
    });
  },
};
