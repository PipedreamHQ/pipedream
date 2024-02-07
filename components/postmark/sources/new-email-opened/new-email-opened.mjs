import common from "../common.mjs";

export default {
  ...common,
  key: "postmark-new-email-opened",
  name: "New Email Opened",
  description:
    "Emit new event when an email is opened by a recipient [(See docs here)](https://postmarkapp.com/developer/webhooks/open-tracking-webhook)",
  version: "0.0.3",
  type: "source",
  props: {
    ...common.props,
    postFirstOpenOnly: {
      type: "boolean",
      label: "Track first open only",
      description: `If enabled, an event will only be emitted the first time the recipient opens the email.
        \\
        Otherwise, the event will be emitted every time an open occurs.`,
    },
  },
  methods: {
    ...common.methods,
    getWebhookProps() {
      return {
        Triggers: {
          "Open": {
            "Enabled": true,
            "PostFirstOpenOnly": false,
          },
        },
      };
    },
    getSummary(body) {
      return `New email opened! MessageID - ${body.MessageID}`;
    },
  },
};
