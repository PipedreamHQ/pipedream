// legacy_hash_id: a_8KiGrJ
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
  key: "postmark-send-single-email",
  name: "Send an email",
  description: "Send an email with Postmark",
  version: "0.1.2",
  type: "action",
  props: {
    postmark,
    subject: {
      type: "string",
      label: "Subject",
      description: "Email subject",
    },
    html_body: {
      type: "string",
      label: "HTML Body",
      description:
        "HTML email message. Required if no `TextBody` is specified.",
      optional: true,
    },
    text_body: {
      type: "string",
      label: "Text Body",
      description:
        "Plain text email message. Required if no `HtmlBody` is specified.",
      optional: true,
    },
    ...objSharedProps,
  },
  async run({ $ }) {
    return await axios($, {
      url: "https://api.postmarkapp.com/email",
      headers: {
        "X-Postmark-Server-Token": `${this.postmark.$auth.api_key}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      method: "POST",
      data: {
        Subject: this.subject,
        HtmlBody: this.html_body,
        TextBody: this.text_body,
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
