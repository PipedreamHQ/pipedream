const slack = require("../slack.app.js");

/* eslint-disable pipedream/required-properties-key, pipedream/required-properties-name,
  pipedream/required-properties-version, pipedream/required-properties-description */
module.exports = {
  type: "action",
  props: {
    slack,
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
    },
    icon_emoji: {
      propDefinition: [
        slack,
        "icon_emoji",
      ],
    },
    icon_url: {
      propDefinition: [
        slack,
        "icon_url",
      ],
    },
    include_sent_via_pipedream_flag: {
      type: "boolean",
      optional: true,
      default: true,
      label: "Include link to workflow",
      description: "Defaults to `true`, includes a link to the workflow at the end of your Slack message.",
    },
  },
  methods: {
    _getWorkflowId() {
      return process.env.PIPEDREAM_WORKFLOW_ID;
    },
    _getTraceId() {
      return process.env.PIPEDREAM_TRACE_ID;
    },
    _makeSentViaPipedreamBlock() {
      const workflowId = this._getWorkflowId();
      const traceId = this._getTraceId();
      const link = `https://pipedream.com/@/${workflowId}/inspect/${traceId}?origin=action&a=slack`;
      return {
        "type": "context",
        "elements": [
          {
            "type": "mrkdwn",
            "text": `Sent via <${link}|Pipedream>`,
          },
        ],
      };
    },
    _makeTextBlock() {
      const { text } = this;
      let serializedText = text;
      // The Slack SDK expects the value of text's "text" property to be a string. If this.text is
      // anything other than string, number, or boolean, then encode it as a JSON string.
      if (typeof text !== "string" && typeof text !== "number" && typeof text !== "boolean") {
        serializedText = JSON.stringify(text);
      }
      return {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": serializedText,
        },
      };
    },
  },
  async run() {
    let blocks = this.blocks;

    if (this.include_sent_via_pipedream_flag == true) {
      const sentViaPipedreamText = this._makeSentViaPipedreamBlock();

      if (!blocks) {
        blocks = [
          this._makeTextBlock(),
        ];
      } else if (typeof blocks === "string") {
        blocks = JSON.parse(blocks);
      }

      blocks.push(sentViaPipedreamText);
    }

    return await this.slack.sdk().chat.postMessage({
      text: this.text,
      channel: this.conversation,
      attachments: this.attachments,
      unfurl_links: this.unfurl_links,
      unfurl_media: this.unfurl_media,
      parse: this.parse,
      as_user: this.as_user,
      username: this.username,
      icon_emoji: this.icon_emoji,
      icon_url: this.icon_url,
      mrkdwn: this.mrkdwn,
      blocks,
      link_names: this.link_names,
      reply_broadcast: this.reply_broadcast,
      thread_ts: this.thread_ts,
    });
  },
};
