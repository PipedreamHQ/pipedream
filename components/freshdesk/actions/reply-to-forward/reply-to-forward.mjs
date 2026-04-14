import { parseObject } from "../../common/utils.mjs";
import freshdesk from "../../freshdesk.app.mjs";

export default {
  key: "freshdesk-reply-to-forward",
  name: "Reply to Forward",
  description: "Reply to a previously forwarded ticket email. [See the documentation](https://developers.freshdesk.com/api/#reply_to_forward).",
  version: "0.0.3",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    freshdesk,
    ticketId: {
      propDefinition: [
        freshdesk,
        "ticketId",
      ],
    },
    body: {
      type: "string",
      label: "Body",
      description: "Content of the reply in HTML format",
    },
    toEmails: {
      type: "string[]",
      label: "To Emails",
      description: "Email addresses to which the reply is addressed",
    },
    userId: {
      propDefinition: [
        freshdesk,
        "agentId",
      ],
      label: "User ID",
      description: "ID of the agent replying to the forward",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      body: this.body,
      to_emails: parseObject(this.toEmails),
      user_id: this.userId,
    };

    const response = await this.freshdesk.replyToForward({
      $,
      ticketId: this.ticketId,
      data,
    });

    $.export("$summary", `Reply to forward sent successfully for ticket ${this.ticketId}`);
    return response;
  },
};
