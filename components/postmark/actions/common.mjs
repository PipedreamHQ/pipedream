import postmark from "../postmark.app.mjs";

export default {
  props: {
    postmark,
    fromEmail: {
      type: "string",
      label: "\"From\" email address",
      description:
        "The sender email address. Must have a registered and confirmed Sender Signature. To include a name, use the format 'Full Name &lt;sender@domain.com&gt;' for the address.",
    },
    toEmail: {
      type: "string",
      label: "Recipient email address(es)",
      description:
        "Recipient email address. Multiple addresses are comma separated. Max 50.",
    },
    ccEmail: {
      type: "string",
      label: "CC email address(es)",
      description:
        "Cc recipient email address. Multiple addresses are comma separated. Max 50.",
      optional: true,
    },
    bccEmail: {
      type: "string",
      label: "BCC email address(es)",
      description:
        "Bcc recipient email address. Multiple addresses are comma separated. Max 50.",
      optional: true,
    },
    tag: {
      type: "string",
      label: "Tag",
      description:
        "Email tag that allows you to categorize outgoing emails and get detailed statistics.",
      optional: true,
    },
    replyTo: {
      type: "string",
      label: "\"Reply To\" email address",
      description:
        "Reply To override email address. Defaults to the Reply To set in the sender signature.",
      optional: true,
    },
    customHeaders: {
      type: "string[]",
      label: "Custom Headers",
      description: "List of custom headers to include.",
      optional: true,
    },
    trackOpens: {
      type: "boolean",
      label: "Track Opens",
      description: `Activate open tracking for this email.
      \\
      **Note:** the email must have \`HTML Body\` to enable open tracking.`,
      optional: true,
    },
    trackLinks: {
      type: "string",
      label: "Track Links",
      description:
        "Activate link tracking for links in the HTML or Text bodies of this email.",
      optional: true,
      options: [
        "None",
        "HtmlAndText",
        "HtmlOnly",
        "TextOnly",
      ],
    },
    attachments: {
      type: "string[]",
      label: "Attachments",
      description: `Each attachment should be a string with the parameters separated by a pipe character \`|\`, in the format: \`Name|Content|ContentType\`. Alternatively, you can pass a string representing an object. All three parameters are required:
      \\
      \\
      \`Name\` - the filename with extension, i.e. \`readme.txt\`
      \\
      \`Content\` - the base64-encoded string with the binary data for the file, i.e. \`dGVzdCBjb250ZW50\`
      \\
      \`ContentType\` - the MIME content type, i.e. \`text/plain\`
      \\
      \\
      Example with pipe-separated parameters: \`readme.txt|dGVzdCBjb250ZW50|text/plain\`
      \\
      Example with JSON-stringified object: \`{"Name":"readme.txt","Content":"dGVzdCBjb250ZW50","ContentType":"text/plain"}\`
      `,
      optional: true,
    },
    metadata: {
      type: "object",
      label: "Metadata",
      description: "Custom metadata key/value pairs.",
      optional: true,
    },
    messageStream: {
      type: "string",
      label: "Message stream",
      description:
        "Set message stream ID that's used for sending. If not provided, message will default to the outbound transactional stream.",
      optional: true,
    },
  },
  methods: {
    getActionRequestCommonData() {
      return {
        From: this.fromEmail,
        To: this.toEmail,
        Cc: this.ccEmail,
        Bcc: this.bccEmail,
        Tag: this.tag,
        ReplyTo: this.replyTo,
        Headers: this.customHeaders,
        TrackOpens: this.trackOpens,
        TrackLinks: this.trackLinks,
        Attachments: this.getAttachmentData(this.attachments),
        Metadata: this.metadata,
        MessageStream: this.messageStream,
      };
    },
    getAttachmentData(attachments) {
      return attachments?.map((str) => {
        let params = str.split("|");
        return params.length === 3
          ? {
            Name: params[0],
            Content: params[1],
            ContentType: params[2],
          }
          : JSON.parse(str);
      });
    },
  },
};
