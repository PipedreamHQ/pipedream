import { ConfigurationError } from "@pipedream/platform";
import teamleaderFocus from "../../teamleader_focus.app.mjs";

export default {
  key: "teamleader_focus-update-ticket",
  name: "Update Ticket",
  description: "Updates a ticket's subject, description, status, or milestone. [See the documentation](https://developer.focus.teamleader.eu/docs/api/tickets-update)",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    teamleaderFocus,
    ticketId: {
      propDefinition: [
        teamleaderFocus,
        "ticketId",
      ],
    },
    subject: {
      type: "string",
      label: "Subject",
      description: "The updated ticket subject.",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "The updated ticket description. Uses Markdown formatting.",
      optional: true,
    },
    ticketStatusId: {
      propDefinition: [
        teamleaderFocus,
        "ticketStatusId",
      ],
    },
    milestoneId: {
      type: "string",
      label: "Milestone ID",
      description: "The ID of the milestone to assign to this ticket.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      ticketId,
      subject,
      description,
      ticketStatusId,
      milestoneId,
    } = this;

    if (!subject && !description && !ticketStatusId && !milestoneId) {
      throw new ConfigurationError("At least one field to update must be provided.");
    }

    const data = {
      id: ticketId,
    };
    if (subject) data.subject = subject;
    if (description) data.description = description;
    if (ticketStatusId) data.ticket_status_id = ticketStatusId;
    if (milestoneId) data.milestone_id = milestoneId;

    await this.teamleaderFocus.updateTicket({
      $,
      data,
    });

    $.export("$summary", `Ticket ${ticketId} updated successfully`);
    return {
      success: true,
      id: ticketId,
    };
  },
};
