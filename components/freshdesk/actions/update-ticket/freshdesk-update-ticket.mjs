import freshdesk from "../../freshdesk.app.mjs";
import { removeNullEntries } from "../../common/utils.mjs";

export default {
  key: "freshdesk-update-ticket",
  name: "Update a Ticket",
  description: "Update status, priority, subject, description, agent, group, tags, etc. [See docs](https://developers.freshdesk.com/api/#update_a_ticket)",
  version: "0.0.6",
  type: "action",
  props: {
    freshdesk,
    ticketId: {
      propDefinition: [
        freshdesk,
        "ticketId",
      ],
    },
    ticketStatus: {
      propDefinition: [
        freshdesk,
        "ticketStatus",
      ],
      optional: true,
    },
    ticketPriority: {
      propDefinition: [
        freshdesk,
        "ticketPriority",
      ],
      optional: true,
    },
    subject: {
      type: "string",
      label: "Subject",
      description: "Ticket subject",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "Detailed ticket description (HTML allowed)",
      optional: true,
    },
    type: {
      type: "string",
      label: "Type",
      description: "Type of ticket (e.g. Question, Incident, etc.)",
      optional: true,
    },
    group_id: {
      type: "integer",
      label: "Group ID",
      description: "ID of the group to assign this ticket to",
      optional: true,
    },
    responder_id: {
      type: "integer",
      label: "Agent ID",
      description: "ID of the agent to assign this ticket to",
      optional: true,
    },
    email: {
      type: "string",
      label: "Requester Email (replaces requester)",
      description: "Updates the requester. If no contact with this email exists, a new one will be created and assigned to the ticket.",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Requester Phone (replaces requester)",
      description: "If no contact with this phone number exists, a new one will be created. If used without email, 'name' is required.",
      optional: true,
    },
    name: {
      type: "string",
      label: "Requester Name (required with phone if no email)",
      description: "Used when creating a contact with phone but no email.",
      optional: true,
    },
    type: {
        type: "string",
        label: "Type",
        description: "Type of ticket (must match one of the allowed values)",
        optional: true,
        options: [
          "Question",
          "Incident",
          "Problem",
          "Feature Request",
          "Refund",
        ],
      },
    custom_fields: {
      type: "object",
      label: "Custom Fields",
      description: "Custom fields as key-value pairs (make sure types match your config)",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      freshdesk,
      ticketId,
      ticketStatus,
      ticketPriority,
      subject,
      description,
      type,
      group_id,
      responder_id,
      email,
      phone,
      name,
      tags,
      custom_fields,
    } = this;

    const data = removeNullEntries({
      status: ticketStatus,
      priority: ticketPriority,
      subject,
      description,
      type,
      group_id,
      responder_id,
      email,
      phone,
      name,
      tags,
      custom_fields,
    });

    if (!Object.keys(data).length) {
      throw new Error("Please provide at least one field to update.");
    }

    const response = await freshdesk._makeRequest({
      $,
      method: "PUT",
      url: `/tickets/${ticketId}`,
      data,
    });

    $.export("$summary", `Ticket ${ticketId} updated successfully`);
    return response;
  },
};


