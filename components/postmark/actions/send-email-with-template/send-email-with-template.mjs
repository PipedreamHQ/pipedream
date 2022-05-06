import axios from "axios";
import { axios as axiosPipedream } from "@pipedream/platform";

export default {
  key: "postmark-send-email-with-template",
  name: "Send an Email using a Template",
  description: "Send an Email using a Template",
  version: "0.1.16",
  type: "action",
  props: {
    postmark: {
      type: "app",
      app: "postmark",
    },
    template_alias: {
      type: "string",
      label: "Template",
      description: "The template to use for this email.",
      async options() {
        return await axios({
          url: "https://api.postmarkapp.com/templates?count=500&offset=0",
          headers: {
            "X-Postmark-Server-Token": `${this.postmark.$auth.api_key}`,
            "Accept": "application/json",
            "Content-Type": "application/json",
          },
          method: "GET",
        })
          .then(({ data }) =>
            data.TotalCount
              ? data.Templates.filter(
                (obj) => obj.TemplateType === "Standard",
              ).map((obj) => {
                return {
                  label: obj.Name,
                  value: obj.Alias,
                };
              })
              : [
                {
                  label:
                      "No templates found for this Postmark account. Create a template, then refresh this field.",
                  value: -1,
                },
              ])
          .catch(() => [
            {
              label:
                "An error ocurred while fetching the list of templates for this Postmark account. Please try again.",
              value: -2,
            },
          ]);
      },
    },
    template_model: {
      type: "object",
      label: "Template Model",
      description:
        "The model to be applied to the specified template to generate the email body and subject.",
    },
    inline_css: {
      type: "boolean",
      label: "Inline CSS",
      description:
        "By default, if the specified template contains an HTMLBody, Postmark will apply the style blocks as inline attributes to the rendered HTML content. You may opt-out of this behavior by passing false for this request field.",
      optional: true,
    },
    from_email: {
      type: "string",
      label: "\"From\" email address",
      description:
        "The sender email address. Must have a registered and confirmed Sender Signature. To include a name, use the format 'Full Name &lt;sender@domain.com&gt;' for the address.",
    },
    to_email: {
      type: "string",
      label: "Recipient email address(es)",
      description:
        "Recipient email address. Multiple addresses are comma separated. Max 50.",
    },
    cc_email: {
      type: "string",
      label: "CC email address(es)",
      description:
        "Cc recipient email address. Multiple addresses are comma separated. Max 50.",
      optional: true,
    },
    bcc_email: {
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
    reply_to: {
      type: "string",
      label: "\"Reply To\" email address",
      description:
        "Reply To override email address. Defaults to the Reply To set in the sender signature.",
      optional: true,
    },
    custom_headers: {
      type: "string[]",
      label: "Custom Headers",
      description: "List of custom headers to include.",
      optional: true,
    },
    track_opens: {
      type: "boolean",
      label: "Track Opens",
      description: "Activate open tracking for this email.",
      optional: true,
    },
    track_links: {
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
    // 'Attachments' pending - the API expects an array of objects, seemingly unsupported by props.
    attachments: {
      type: "string[]",
      label: "Attachments",
      description: `Each attachment should be a string with the parameters separated by \`|\`, in the format: \`Name|Content|ContentType\`
      \\
      - \`Name\` is the filename with extension, i.e. \`readme.txt\`
      \\
      - \`Content\` is the base64-encoded string with the binary data for the file, i.e. \`dGVzdCBjb250ZW50\`
      \\
      - \`ContentType\` is the MIME content type, i.e. \`text/plain\``,
      optional: true,
    },
    metadata: {
      type: "object",
      label: "Metadata",
      description: "Custom metadata key/value pairs.",
      optional: true,
    },
    message_stream: {
      type: "string",
      label: "Message stream",
      description:
        "Set message stream ID that's used for sending. If not provided, message will default to the outbound transactional stream.",
      optional: true,
    },
  },
  async run({ $ }) {
    return await axiosPipedream($, {
      url: "https://api.postmarkapp.com/email/withTemplate",
      headers: {
        "X-Postmark-Server-Token": `${this.postmark.$auth.api_key}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      method: "POST",
      data: {
        TemplateAlias: this.template_alias,
        TemplateModel: this.template_model,
        InlineCSS: this.inline_css,
        From: this.from_email,
        To: this.to_email,
        Cc: this.cc_email,
        Bcc: this.bcc_email,
        Tag: this.tag,
        ReplyTo: this.reply_to,
        Headers: this.custom_headers,
        TrackOpens: this.track_opens,
        TrackLinks: this.track_links,
        Attachments: this.attachments?.map((str) => {
          let params = str.split("|");
          return {
            Name: params[0],
            Content: params[1],
            ContentType: params[2],
          };
        }),
        Metadata: this.metadata,
        MessageStream: this.message_stream,
      },
    });
  },
};
