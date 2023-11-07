// import common from "./send-message.mjs";

/* eslint-disable pipedream/required-properties-key, pipedream/required-properties-name,
  pipedream/required-properties-version, pipedream/required-properties-description */
export default {
  type: "action",
  props: {
    resumeExecutionButtonText: {
      type: "string",
      label: "Appoval Button Text",
      description: "Text to display on the approval button",
      default: "Yes",
    },
    cancelExecutionButtonText: {
      type: "string",
      label: "Cancelation Button Text",
      description: "Text to display on the cancelation button",
      default: "No",
    },
    approvalRequestTimeout: {
      type: "integer",
      label: "Approval Request Timeout",
      description: "Time in minutes to wait for approval. After the request times out, workflow execution will cancel.",
      default: 60,
      optional: true,
    },
  },
  methods: {},
  async run({ $ }) {
    const timeout = 1000 * 60 * this.approvalRequestTimeout;
    const {
      resume_url, cancel_url,
    } = $.flow.suspend(timeout);
    const blocks = [
      {
        "type": "actions",
        "elements": [
          {
            "type": "button",
            "text": {
              "type": "plain_text",
              "text": this.resumeExecutionButtonText,
              "emoji": true,
            },
            "url": resume_url,
            "action_id": `${process.env.PIPEDREAM_WORKFLOW_ID}-resume-execution`,
            "style": "primary",
          },
          {
            "type": "button",
            "text": {
              "type": "plain_text",
              "text": this.cancelExecutionButtonText,
              "emoji": true,
            },
            "url": cancel_url,
            "action_id": `${process.env.PIPEDREAM_WORKFLOW_ID}-cancel-execution`,
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

