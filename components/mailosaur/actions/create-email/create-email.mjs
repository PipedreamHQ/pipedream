import { ConfigurationError } from "@pipedream/platform";
import mailosaur from "../../mailosaur.app.mjs";

export default {
  key: "mailosaur-create-email",
  name: "Create and Send Email via Mailosaur",
  description: "Sends an email through Mailosaur. [See the documentation](https://mailosaur.com/docs/api)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    mailosaur,
    serverId: {
      propDefinition: [
        mailosaur,
        "serverId",
      ],
    },
    to: {
      type: "string",
      label: "To",
      description: "The verified external email address to which the email should be sent.",
    },
    from: {
      type: "string",
      label: "From",
      description: "Optionally overrides of the message's `from` address. This **must** be an address ending with `YOUR_SERVER.mailosaur.net`, such as `my-emails @a1bcdef2.mailosaur.net`.",
      optional: true,
    },
    subject: {
      type: "string",
      label: "Subject",
      description: "The subject line for an email.",
    },
    html: {
      type: "object",
      label: "HTML",
      description: "An object with HTML properties. Please [see the documentation](https://mailosaur.com/docs/api#send-an-email) for more details.",
      optional: true,
    },
    text: {
      type: "object",
      label: "Text",
      description: "An object with Plain text properties. Please [see the documentation](https://mailosaur.com/docs/api#send-an-email) for more details.",
      optional: true,
    },
    send: {
      type: "boolean",
      label: "Send",
      description: "If `false`, the email will be created in your server, but will not be sent.",
    },
  },
  async run({ $ }) {
    if ((!!this.send) && (!this.html && !this.text)) {
      throw new ConfigurationError("Please provide either HTML or plain text content.");
    }

    const {
      mailosaur,
      serverId,
      ...data
    } = this;

    const response = await mailosaur.sendEmail({
      $,
      params: {
        server: serverId,
      },
      data,
    });

    $.export("$summary", `Email sent successfully to ${this.to}`);
    return response;
  },
};
