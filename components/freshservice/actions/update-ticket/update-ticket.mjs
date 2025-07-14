import { ConfigurationError } from "@pipedream/platform";
import freshservice from "../../freshservice.app.mjs";
import { TICKET_STATUS, TICKET_PRIORITY } from "../../common/constants.mjs";
import { removeNullEntries } from "../../common/utils.mjs";

export default {
  key: "freshservice-update-ticket",
  name: "Update Ticket",
  description: "Update a ticket in Freshservice. Optionally add an internal note instead of updating the ticket. [See the documentation](https://api.freshservice.com/v2/#update_ticket)",
  version: "0.0.1",
  type: "action",
  props: {
    freshservice,
    ticketId: {
      propDefinition: [
        freshservice,
        "ticketId",
      ],
    },
    status: {
      propDefinition: [
        freshservice,
        "ticketStatus",
      ],
      optional: true,
    },
    priority: {
      propDefinition: [
        freshservice,
        "ticketPriority",
      ],
      optional: true,
    },
    subject: {
      type: "string",
      label: "Subject",
      description: "Subject of the ticket",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "Description of the ticket",
      optional: true,
    },
    group_id: {
      propDefinition: [
        freshservice,
        "groupId",
      ],
      optional: true,
    },
    responder_id: {
      propDefinition: [
        freshservice,
        "agentId",
      ],
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email of the requester",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "Phone number of the requester",
      optional: true,
    },
    name: {
      type: "string",
      label: "Name",
      description: "Name of the requester",
      optional: true,
    },
    type: {
      type: "string",
      label: "Type",
      description: "Type of the ticket",
      options: [
        "Incident",
        "Service Request",
        "Change",
        "Problem",
        "Release",
      ],
      optional: true,
    },
    custom_fields: {
      type: "object",
      label: "Custom Fields",
      description: "Custom fields as a JSON object",
      optional: true,
    },
    internalNote: {
      type: "boolean",
      label: "Internal Note",
      description: "If true, add an internal note instead of updating the ticket",
      optional: true,
      default: false,
    },
    noteBody: {
      type: "string",
      label: "Note Body",
      description: "Body of the internal note (only used if Internal Note is true)",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      ticketId,
      internalNote,
      noteBody,
      custom_fields,
      ...otherProps
    } = this;

    // Handle internal note creation
    if (internalNote) {
      if (!noteBody) {
        throw new ConfigurationError("Note Body is required when Internal Note is enabled");
      }

      const noteResponse = await this.freshservice.createNote({
        ticketId,
        data: {
          body: noteBody,
          private: true,
        },
        $,
      });

      $.export("$summary", `Successfully added internal note to ticket ${ticketId}`);
      return noteResponse;
    }

    // Handle ticket update
    const data = removeNullEntries(otherProps);
    
    if (custom_fields) {
      data.custom_fields = this.freshservice.parseIfJSONString(custom_fields);
    }

    // Validate that at least one field is provided for update
    if (Object.keys(data).length === 0) {
      throw new ConfigurationError("At least one field must be provided to update the ticket");
    }

    const response = await this.freshservice.updateTicket({
      ticketId,
      data,
      $,
    });

    const statusLabel = TICKET_STATUS[response.ticket?.status] || response.ticket?.status;
    const priorityLabel = TICKET_PRIORITY[response.ticket?.priority] || response.ticket?.priority;
    
    $.export("$summary", `Successfully updated ticket ${ticketId}${statusLabel ? ` (Status: ${statusLabel})` : ""}${priorityLabel ? ` (Priority: ${priorityLabel})` : ""}`);
    return response;
  },
};