import axios from "axios";
import { axios as axiosPipedream } from "@pipedream/platform";

export default {
  type: "app",
  app: "postmark",
  propDefinitions: {
    templateAlias: {
      type: "string",
      label: "Template",
      description: "The template to use for this email.",
      async options() {
        return this.listTemplates();
      },
    },
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
      description: "Activate open tracking for this email.",
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
    _apikey() {
      return this.$auth.api_key;
    },
    async listTemplates() {
      const { data } = await axios({
        url: "https://api.postmarkapp.com/templates?Count=500&Offset=0&TemplateType=Standard",
        headers: this.getHeaders(),
        method: "GET",
      });

      return data.TotalCount
        ? data.Templates.map((obj) => {
          return {
            label: obj.Name,
            value: obj.Alias,
          };
        })
        : [];

    },
    getHeaders() {
      return {
        "X-Postmark-Server-Token": this._apikey(),
        "Content-Type": "application/json",
        "Accept": "application/json",
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
    listSharedProps() {
      return [
        "fromEmail",
        "toEmail",
        "ccEmail",
        "bccEmail",
        "tag",
        "replyTo",
        "customHeaders",
        "trackOpens",
        "trackLinks",
        "attachments",
        "metadata",
        "messageStream",
      ];
    },
    async sharedActionRequest($, action, endpoint, uniqueProps) {
      return await axiosPipedream($, {
        url: `https://api.postmarkapp.com/${endpoint}`,
        headers: this.getHeaders(),
        method: "POST",
        data: {
          ...uniqueProps,
          From: action.fromEmail,
          To: action.toEmail,
          Cc: action.ccEmail,
          Bcc: action.bccEmail,
          Tag: action.tag,
          ReplyTo: action.replyTo,
          Headers: action.customHeaders,
          TrackOpens: action.trackOpens,
          TrackLinks: action.trackLinks,
          Attachments: this.getAttachmentData(this.attachments),
          Metadata: action.metadata,
          MessageStream: action.messageStream,
        },
      });
    },
    async setServerInfo(params) {
      return await axios
        .put(
          "https://api.postmarkapp.com/server",
          params,
          {
            headers: this.getHeaders(),
          },
        )
        .then(({ data }) => data);
    },
  },
};
