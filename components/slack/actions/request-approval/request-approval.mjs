import common from "../common/send-message.mjs";

export default {
  name: "Request Approval",
  version: "0.0.{{ts}};",
  key: "request-approval",
  description: "",
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
    ...common.props,
    resumeExecutionButtonText: {
      type: "string",
      label: "Appoval Button Text",
      description: "Text to display on the approval button",
      default: "Yes",
      optional: true,
    },
    cancelExecutionButtonText: {
      type: "string",
      label: "Cancelation Button Text",
      description: "Text to display on the cancelation button",
      default: "No",
      optional: true,
    },
    approvalRequestTimeout: {
      type: "integer",
      label: "Approval Request Timeout",
      description: "Time in minutes to wait for approval. After the request times out, workflow execution will cancel.",
      default: 60,
      optional: true,
    },
  },
  type: "action",
  methods: {},
  async run({ $ }) {
    const timeout = 1000 * 60 * this.approvalRequestTimeout;
    const {
      resume_url, cancel_url,
    } = $.flow.suspend(timeout);
    const blocks = [
      {
        "type": "header",
        "text": {
          "type": "plain_text",
          "text": "Do you want to send that message to all of the below Slack Connect customer channels right now?",
          "emoji": true,
        },
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          // eslint-disable-next-line quotes
          "text": `\`\`\`foo bar\`\`\``,
        },
      },
      {
        "type": "actions",
        "elements": [
          {
            "type": "button",
            "text": {
              "type": "plain_text",
              "text": "Yes",
              "emoji": true,
            },
            "url": resume_url,
            "action_id": "send-slack-announcements-to-slack-connect-true",
            "style": "primary",
          },
          {
            "type": "button",
            "text": {
              "type": "plain_text",
              "text": "No",
              "emoji": true,
            },
            "url": cancel_url,
            "action_id": "send-slack-announcements-to-slack-connect-false",
            "style": "danger",
          },
        ],
      },
    ];
    return {
      blocks,
    };
  },
};
