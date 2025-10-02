import sourceforge from "../../sourceforge.app.mjs";

export default {
  key: "sourceforge-update-ticket",
  name: "Update Ticket",
  description: "Updates an existing ticket. [See the documentation](https://anypoint.mulesoft.com/apiplatform/sourceforge/#/portals/organizations/98f11a03-7ec0-4a34-b001-c1ca0e0c45b1/apis/32951/versions/34322)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    sourceforge,
    project: {
      propDefinition: [
        sourceforge,
        "project",
      ],
    },
    ticket: {
      propDefinition: [
        sourceforge,
        "ticket",
        (c) => ({
          project: c.project,
        }),
      ],
    },
    summary: {
      propDefinition: [
        sourceforge,
        "summary",
      ],
      optional: true,
    },
    description: {
      propDefinition: [
        sourceforge,
        "description",
      ],
    },
    labels: {
      propDefinition: [
        sourceforge,
        "labels",
      ],
    },
    assignee: {
      propDefinition: [
        sourceforge,
        "assignee",
      ],
    },
  },
  async run({ $ }) {
    const { ticket } = await this.sourceforge.getTicket({
      project: this.project,
      ticket: this.ticket,
      $,
    });

    const response = await this.sourceforge.updateTicket({
      project: this.project,
      ticket: this.ticket,
      params: {
        "ticket_form.summary": this.summary || ticket.summary,
        "ticket_form.description": this.description || ticket.description,
        "ticket_form.labels": this.labels?.length
          ? this.labels.join(",")
          : undefined,
        "ticket_form.assigned_to": this.assignee,
      },
      $,
    });

    if (response) {
      $.export("$summary", `Successfully updated ticket with ID ${response.ticket._id}.`);
    }

    return response;
  },
};
