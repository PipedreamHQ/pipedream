export default {
  props: {
    fromEmail: {
      type: "string",
      label: "\"From\" email address",
      description: "The sender email address. To include a name, use the format 'Full Name &lt;sender@domain.com&gt;' for the address.",
    },
    toEmail: {
      type: "string[]",
      label: "Recipient email address(es)",
      description: "Recipient email address. Max 50.",
    },
    ccEmail: {
      type: "string[]",
      label: "CC email address(es)",
      description: "Cc recipient email address. Max 50.",
      optional: true,
    },
    bccEmail: {
      type: "string[]",
      label: "BCC email address(es)",
      description: "Bcc recipient email address. Max 50.",
      optional: true,
    },
    replyTo: {
      type: "string",
      label: "\"Reply To\" email address",
      description: "Reply To override email address. Defaults to the Reply To set in the sender signature.",
      optional: true,
    },
    customHeaders: {
      type: "string[]",
      label: "Custom Headers",
      description: `List of custom headers to include.
      \\
      Each attachment should be a string with the parameters separated by a pipe character \`|\`, in the format: \`header|value\`. Alternatively, you can pass a string representing an object. Both parameters are required:
      \\
      \\
      \`header\` - the header key name, i.e. \`some-header\`
      \\
      \`value\` - the string value of the header, i.e. \`the-value\`
      \\
      \\
      Example with pipe-separated parameters: \`some-custom-header|the-value\`
      \\
      Example with JSON-stringified object: \`{"header":"some-custom-header","value":"the-value"}\`
      `,
      optional: true,
    },
    attachments: {
      type: "string[]",
      label: "Attachments",
      description: `List of attachments to include.
      \\
      Each attachment should be a string with the parameters separated by a pipe character \`|\`, in the format: \`Name|Content|ContentType\`. Alternatively, you can pass a string representing an object. All three parameters are required:
      \\
      \\
      \`filename\` - the filename with extension, i.e. \`readme.txt\`
      \\
      \`fileblob\` - the base64-encoded string with the binary data for the file, i.e. \`dGVzdCBjb250ZW50\`
      \\
      \`mimetype\` - the MIME content type, i.e. \`text/plain\`
      \\
      \\
      Example with pipe-separated parameters: \`readme.txt|dGVzdCBjb250ZW50|text/plain\`
      \\
      Example with JSON-stringified object: \`{"filename":"readme.txt","fileblob":"dGVzdCBjb250ZW50","mimetype":"text/plain"}\`
      `,
      optional: true,
    },
    ignoreFailures: {
      type: "boolean",
      label: "Ignore Failures",
      description: "Should this action ignore failures to send an email?",
      optional: true,
    },
  },
  methods: {
    getActionRequestCommonData() {
      return {
        sender: this.fromEmail,
        to: this.toEmail,
        cc: this.ccEmail,
        bcc: this.bccEmail,
        reply_to: this.replyTo,
        custom_headers: [
          ...this.getCustomHeaderData(this.customHeaders),
          ...this.getReplyToHeaders(this.replyTo),
        ],
        attachments: this.getAttachmentData(this.attachments),
      };
    },
    getAttachmentData(attachments: any[]) {
      return attachments?.map((str) => {
        const params = str.split("|");
        return params.length === 3
          ? {
            filename: params[0],
            fileblob: params[1],
            mimetype: params[2],
          }
          : JSON.parse(str);
      });
    },
    getReplyToHeaders(replyToEmail: string) {
      return replyToEmail
        ? [
          {
            header: "Reply-To",
            value: replyToEmail,
          },
        ]
        : [];
    },
    getCustomHeaderData(headers: any[]) {
      return headers
        ? headers?.map((str) => {
          const params = str.split("|");
          return params.length === 2
            ? {
              header: params[0],
              value: params[1],
            }
            : JSON.parse(str);
        })
        : [];
    },
  },
};
