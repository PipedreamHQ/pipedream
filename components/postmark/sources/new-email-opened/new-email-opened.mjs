import postmark from "../../postmark.app.mjs";

export default {
  key: "postmark-new-email-opened",
  name: "New email opened",
  description: "Emit new event when an email is opened by a recipient",
  version: "0.0.1",
  type: "source",
  props: {
    postmark,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    trackOpensByDefault: {
      type: "boolean",
      label: "Track opens by default",
      description: `If enabled, all emails being sent through this server will have open tracking enabled.
        \\
        Otherwise, only emails that have open tracking explicitly set will trigger this event when opened.`,
    },
    postFirstOpenOnly: {
      type: "boolean",
      label: "Track first open only",
      description: `If enabled, an event will only be emitted the first time the recipient opens the email.
        \\
        Otherwise, the event will be emitted every time an open occurs.`,
    },
  },
  hooks: {
    async activate() {
      return this.postmark.setServerInfo({
        OpenHookUrl: this.http.endpoint,
        PostFirstOpenOnly: this.postFirstOpenOnly,
        TrackOpens: this.trackOpensByDefault,
      });
    },
    async deactivate() {
      return this.postmark.setServerInfo({
        OpenHookUrl: "",
      });
    },
  },
  async run(event) {
    this.http.respond({
      status: 200,
    });

    this.$emit(event);
  },
};
