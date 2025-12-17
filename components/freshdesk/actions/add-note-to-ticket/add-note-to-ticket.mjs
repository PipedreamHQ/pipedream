import freshdesk from "../../freshdesk.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "freshdesk-add-note-to-ticket",
  name: "Add Note to Ticket",
  description: "Add a note or conversation to an existing ticket. [See the documentation](https://developers.freshdesk.com/api/#add_note_to_a_ticket).",
  version: "0.0.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
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
      label: "Note Body",
      description: "Content of the note in HTML format",
    },
    private: {
      type: "boolean",
      label: "Private Note",
      description: "Set to true if the note is private (internal)",
      default: false,
    },
    incoming: {
      type: "boolean",
      label: "Incoming",
      description: "Set to true if the note should be marked as incoming (false for outgoing)",
      default: false,
      optional: true,
    },
    user_id: {
      propDefinition: [
        freshdesk,
        "agentId",
      ],
      label: "User ID",
      description: "ID of the user creating the note (defaults to the API user)",
      optional: true,
    },
    notify_emails: {
      type: "string[]",
      label: "Notify Emails",
      description: "Array of email addresses to notify about this note",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      freshdesk,
      ticketId,
      body,
      private: isPrivate,
      incoming,
      user_id,
      notify_emails,
    } = this;

    if (!body || !body.trim()) {
      throw new ConfigurationError("Note body cannot be empty");
    }

    const ticketName = await freshdesk.getTicketName(ticketId) || "Unknown Ticket";

    const data = {
      body,
      private: isPrivate,
    };

    if (incoming !== undefined) {
      data.incoming = incoming;
    }

    if (user_id) {
      const userId = Number(user_id);
      if (isNaN(userId)) {
        throw new ConfigurationError("User ID must be a valid number");
      }
      data.user_id = userId;
    }

    if (notify_emails && notify_emails.length > 0) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const invalidEmails = notify_emails.filter((email) => !emailRegex.test(email));
      if (invalidEmails.length > 0) {
        throw new ConfigurationError(`Invalid email addresses: ${invalidEmails.join(", ")}`);
      }
      data.notify_emails = notify_emails;
    }

    const response = await freshdesk.addNoteToTicket({
      $,
      ticketId: Number(ticketId),
      data,
    });

    $.export("$summary", `Note added to ticket "${ticketName}" (ID: ${ticketId})`);
    return response;
  },
};
