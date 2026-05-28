import { ConfigurationError } from "@pipedream/platform";
import { parseObject } from "../../common/utils.mjs";
import helpwise from "../../helpwise.app.mjs";

export default {
  key: "helpwise-send-email",
  name: "Send Email",
  description: "Sends an email to a contact from Helpwise using the legacy send-mail API. [See the documentation](https://documenter.getpostman.com/view/29744652/2s9YC5yYKf#intro)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    helpwise,
    mailboxId: {
      propDefinition: [
        helpwise,
        "mailboxId",
      ],
    },
    to: {
      propDefinition: [
        helpwise,
        "to",
      ],
    },
    cc: {
      propDefinition: [
        helpwise,
        "to",
      ],
      label: "CC",
      description: "CC email addresses of your customers",
      optional: true,
    },
    subject: {
      type: "string",
      label: "Subject",
      description: "Email subject",
    },
    body: {
      type: "string",
      label: "Message",
      description: "Email body",
    },
    replyTo: {
      type: "string",
      label: "Reply To",
      description: "Reply to email address",
      optional: true,
    },
  },
  async run({ $ }) {
    try {
      const response = await this.helpwise.sendMail({
        $,
        data: {
          mailbox_id: this.mailboxId,
          to: parseObject(this.to)?.join(),
          cc: parseObject(this.cc)?.join(),
          subject: this.subject,
          body: this.body,
          replyTo: this.replyTo,
        },
      });

      $.export("$summary", "Email sent successfully");
      return response;
    } catch (error) {
      const errorMessage = JSON.parse(error.message)?.message;
      if (errorMessage === "mailbox_id is incorrect") {
        throw new ConfigurationError("This Mailbox is not allowed to send emails");
      }
      throw new ConfigurationError(errorMessage);
    }
  },
};
