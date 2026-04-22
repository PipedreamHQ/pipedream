import teamleaderFocus from "../../teamleader_focus.app.mjs";

export default {
  key: "teamleader_focus-update-ticket",
  name: "Update Ticket",
  description: "Updates a ticket's fields such as subject, description, status, assignee, and more. [See the documentation](https://developer.focus.teamleader.eu/docs/api/tickets-update)",
  version: "0.0.1",
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
      type: "string",
      label: "Ticket Status ID",
      description: "The ID of the new ticket status.",
      optional: true,
    },
    milestoneId: {
      type: "string",
      label: "Milestone ID",
      description: "The ID of the milestone to assign to this ticket.",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      id: this.ticketId,
    };
    if (this.subject) data.subject = this.subject;
    if (this.description) data.description = this.description;
    if (this.ticketStatusId) data.ticket_status_id = this.ticketStatusId;
    if (this.milestoneId) data.milestone_id = this.milestoneId;

    await this.teamleaderFocus.updateTicket({
      $,
      data,
    });

    $.export("$summary", `Ticket ${this.ticketId} updated successfully`);
    return {
      success: true,
      id: this.ticketId,
    };
  },
};
