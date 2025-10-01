import lighthouse from "../../lighthouse.app.mjs";
import constants from "../common/constants.mjs";

export default {
  name: "Create Ticket",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "lighthouse-create-ticket",
  description: "Creates a ticket. [See docs here](http://help.lighthouseapp.com/kb/api/tickets#create-ticket-code-post-projects-project_id-tickets-xml-code-)",
  type: "action",
  props: {
    lighthouse,
    projectId: {
      propDefinition: [
        lighthouse,
        "projectId",
      ],
    },
    title: {
      label: "Title",
      description: "Title of the ticket",
      type: "string",
    },
    body: {
      label: "Body",
      description: "Body of the ticket",
      type: "string",
    },
    state: {
      label: "State",
      description: "State of the ticket",
      type: "string",
      options: constants.STATES,
    },
    milestoneId: {
      propDefinition: [
        lighthouse,
        "milestoneId",
        (c) => ({
          projectId: c.projectId,
        }),
      ],
      optional: true,
    },
    tags: {
      label: "Tags",
      description: "Tags of the ticket. E.g. `Urgent,LowCode` or `Urgent LowCode`",
      type: "string",
      optional: true,
    },
  },
  async run({ $ }) {
    const { ticket } = await this.lighthouse.createTicket({
      $,
      projectId: this.projectId,
      data: {
        ticket: {
          "title": this.title,
          "body": this.body,
          "state": this.state,
          "milestone-id": this.milestoneId,
          "tag": this.tags,
        },
      },
    });

    if (ticket) {
      $.export("$summary", `Successfully created ticket with number ${ticket.number}`);
    }

    return ticket;
  },
};
