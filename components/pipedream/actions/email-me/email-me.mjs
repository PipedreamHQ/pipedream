// legacy_hash_id: a_vgi84r
export default {
  key: "pipedream-email-me",
  name: "Send Yourself an Email",
  description: "Customize and send an email to the email address you registered with Pipedream. The email will be sent by notifications@pipedream.com.",
  version: "0.4.1",
  type: "action",
  props: {
    subject: {
      type: "string",
    },
    text: {
      type: "string",
    },
    html: {
      type: "string",
      optional: true,
    },
    include_collaborators: {
      type: "boolean",
      optional: true,
    },
  },
  async run({ $ }) {
    const options = {
      subject: this.subject,
      text: this.text,
    };
    if (this.html) {
      options.html = this.html;
    }
    if (this.include_collaborators) {
      options.include_collaborators = this.include_collaborators;
    }
    $.send.email(options);
  },
};
