import sourceforge from "../../sourceforge.app.mjs";

export default {
  key: "sourceforge-create-ticket",
  name: "Create Ticket",
  description: "Creates a new ticket. [See the documentation](https://anypoint.mulesoft.com/apiplatform/sourceforge/#/portals/organizations/98f11a03-7ec0-4a34-b001-c1ca0e0c45b1/apis/32951/versions/34322)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
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
    summary: {
      propDefinition: [
        sourceforge,
        "summary",
      ],
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
    const response = await this.sourceforge.createTicket({
      project: this.project,
      params: {
        "ticket_form.summary": this.summary,
        "ticket_form.description": this.description,
        "ticket_form.labels": this.labels?.length
          ? this.labels.join(",")
          : undefined,
        "ticket_form.assigned_to": this.assignee,
      },
      $,
    });

    if (response) {
      $.export("$summary", `Successfully created ticket with ID ${response.ticket._id}.`);
    }

    return response;
  },
};
