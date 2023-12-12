import common from "../common.mjs";

export default {
  ...common,
  key: "postmark-new-email-opened",
  name: "New Email Opened",
  description:
    "Emit new event when an email is opened by a recipient [(See docs here)](https://postmarkapp.com/developer/webhooks/open-tracking-webhook)",
  version: "0.0.1",
  type: "source",
  props: {
    ...common.props,
    trackOpensByDefault: {
      type: "boolean",
      label: "Track opens by default",
      description: `If enabled, all emails being sent through this server will have open tracking enabled by default. Otherwise, only emails that have open tracking explicitly set will trigger this event when opened.
        \\
        **Note:** only emails with \`HTML Body\` will have open tracking enabled.
        `,
    },
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
        PostFirstOpenOnly: this.postFirstOpenOnly,
        TrackOpens: this.trackOpensByDefault,
      };
    },
    getWebhookType() {
      return "OpenHookUrl";
    },
  },
};
