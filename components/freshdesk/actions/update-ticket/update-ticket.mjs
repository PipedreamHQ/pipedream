import freshdesk from "../../freshdesk.app.mjs";
import { removeNullEntries } from "../../common/utils.mjs";

export default {
  key: "freshdesk-update-ticket",
  name: "Update a Ticket",
  description: "Update status, priority, subject, description, agent, group, etc.  [See the documentation](https://developers.freshdesk.com/api/#update_ticket).",
  version: "0.0.7",
  annotations: {
    destructiveHint: true,
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
    status: {
      propDefinition: [
        freshdesk,
        "ticketStatus",
      ],
      optional: true,
    },
    priority: {
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
    group_id: {
      propDefinition: [
        freshdesk,
        "groupId",
      ],
    },
    responder_id: {
      propDefinition: [
        freshdesk,
        "agentId",
      ],
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
      ...fields
    } = this;

    const data = removeNullEntries(fields);

    const ticketName = await freshdesk.getTicketName(ticketId) || "Unknown Ticket";

    if (!Object.keys(data).length) {
      throw new Error("Please provide at least one field to update.");
    }

    if (data.custom_fields) freshdesk.parseIfJSONString(data.custom_fields);

    const response = await freshdesk._makeRequest({
      $,
      method: "PUT",
      url: `/tickets/${ticketId}`,
      data,
    });

    $.export("$summary", `Ticket "${ticketName}" (ID: ${this.ticketId}) updated successfully`);
    return response;
  },
};
