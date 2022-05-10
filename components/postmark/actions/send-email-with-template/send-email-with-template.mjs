import { axios } from "@pipedream/platform";
import postmark from "../../postmark.app.mjs";

let objSharedProps = {};
postmark.methods.listSharedProps().forEach((propName) => {
  objSharedProps[propName] = {
    propDefinition: [
      postmark,
      propName,
    ],
  };
});

export default {
  key: "postmark-send-email-with-template",
  name: "Send an email with template",
  description: "Send an email with Postmark using a template",
  version: "0.1.21",
  type: "action",
  props: {
    postmark,
    template_alias: {
      type: "string",
      label: "Template",
      description: "The template to use for this email.",
      options() {
        return this.postmark.listTemplates();
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
    ...objSharedProps,
  },
  async run({ $ }) {
    return await axios($, {
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
          return params.length === 3
            ? {
              Name: params[0],
              Content: params[1],
              ContentType: params[2],
            }
            : JSON.parse(str);
        }),
        Metadata: this.metadata,
        MessageStream: this.message_stream,
      },
    });
  },
};
