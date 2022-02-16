// legacy_hash_id: a_8KiGrJ
import { axios } from "@pipedream/platform";

export default {
  key: "postmark-send-single-email",
  name: "Send an Email with Postmark to a Single Recipient",
  description: "Send an Email with Postmark to a Single Recipient",
  version: "0.1.1",
  type: "action",
  props: {
    postmark: {
      type: "app",
      app: "postmark",
    },
    from_email: {
      type: "string",
      label: "From Email",
    },
    to_email: {
      type: "string",
      label: "To Email",
    },
    cc_email: {
      type: "string",
      label: "CC Email",
      optional: true,
    },
    bcc_email: {
      type: "string",
      label: "BCC Email",
      optional: true,
    },
    subject: {
      type: "string",
      label: "Subject",
    },
    tag: {
      type: "string",
      label: "Tag",
      optional: true,
    },
    html_body: {
      type: "string",
      label: "Html Body",
      optional: true,
    },
    text_body: {
      type: "string",
      label: "Text Body",
      optional: true,
    },
    reply_to: {
      type: "string",
      label: "Reply To Email",
      optional: true,
    },
    track_opens: {
      type: "boolean",
      optional: true,
    },
    track_links: {
      type: "string",
      label: "Track Links",
      description: "Activate link tracking for links in the HTML or Text bodies of this email. Possible options: None HtmlAndText HtmlOnly TextOnly",
      optional: true,
    },
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
        "From": this.from_email,
        "To": this.to_email,
        "Cc": this.cc_email,
        "Bcc": this.bcc_email,
        "Subject": this.subject,
        "Tag": this.tag,
        "HtmlBody": this.html_body,
        "TextBody": this.text_body,
        "ReplyTo": this.reply_to,
        "TrackOpens": this.track_opens,
        "TrackLinks": this.track_links,
      },
    });
  },
};
