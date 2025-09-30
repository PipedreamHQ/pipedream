import { ConfigurationError } from "@pipedream/platform";
import sare from "../../sare.app.mjs";

export default {
  key: "sare-send-email",
  name: "Send Transactional Email",
  description: "Send a transactional email. [See the documentation](https://dev.sare.pl/rest-api/other/index.html#post-/send/mail/transactional)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    sare,
    email: {
      propDefinition: [
        sare,
        "email",
      ],
    },
    subject: {
      propDefinition: [
        sare,
        "subject",
      ],
    },
    from: {
      propDefinition: [
        sare,
        "from",
      ],
    },
    newsletterType: {
      type: "string",
      label: "Newsletter Type",
      description: "The type of the newsletter you want to send.",
      optional: true,
      options: [
        "ready",
        "temporary",
      ],
    },
    newsletter: {
      propDefinition: [
        sare,
        "newsletter",
        ({ newsletterType }) => ({
          newsletterType,
        }),
      ],
      optional: true,
    },
    html: {
      type: "string",
      label: "HTML",
      description: "Message content in html format.",
      optional: true,
    },
    txt: {
      type: "string",
      label: "TXT",
      description: "Message content in text format.",
      optional: true,
    },
    encoding: {
      type: "string",
      label: "Encoding",
      description: "Coding of the sent newsletter. The coding must be consistent with those available in the system.",
      optional: true,
    },
    replyto: {
      type: "string",
      label: "Reply To",
      description: "Reply-To field for shipping. The value should be a syntactically valid email address.",
      optional: true,
    },
  },
  async run({ $ }) {
    if ((!this.newsletter) && (!this.html) && (!this.txt)) {
      throw new ConfigurationError("You must provide at least **Newsletter**, **HTML** or **TXT**.");
    }

    const response = await this.sare.sendTransactionalEmail({
      $,
      data: [
        {
          email: this.email,
          subject: this.subject,
          from: this.from,
          newsletter: this.newsletter,
          html: this.html,
          txt: this.txt,
          encoding: this.encoding,
          replyto: this.replyto,
        },
      ],
    });
    $.export("$summary", `Successfully sent email to ${this.email}`);
    return response;
  },
};
