import connectwise from "../../connectwise_psa.app.mjs";

export default {
  key: "connectwise_psa-create-ticket",
  name: "Create Ticket",
  description: "Creates a new ticket in Connectwise. [See the documentation](https://developer.connectwise.com/Products/ConnectWise_PSA/REST#/Tickets/postServiceTickets)",
  version: "0.1.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    connectwise,
    summary: {
      type: "string",
      label: "Summary",
      description: "The subject line or description line for the ticket",
    },
    company: {
      propDefinition: [
        connectwise,
        "company",
      ],
    },
    contact: {
      propDefinition: [
        connectwise,
        "contact",
      ],
    },
    priority: {
      propDefinition: [
        connectwise,
        "priority",
      ],
    },
    note: {
      type: "string[]",
      label: "Note(s)",
      description: "Text content of one or more notes to add to the ticket",
      optional: true,
    },
  },
  methods: {
    createTicketNote({
      id, ...args
    }) {
      return this.connectwise._makeRequest({
        method: "POST",
        path: `/service/tickets/${id}/notes`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const response = await this.connectwise.createTicket({
      $,
      data: {
        summary: this.summary,
        company: {
          id: this.company,
        },
        contact: this.contact
          ? {
            id: this.contact,
          }
          : undefined,
        priority: this.priority
          ? {
            id: this.priority,
          }
          : undefined,
      },
    });
    const { id } = response;
    const { note } = this;
    const createdNotes = [];
    if (id && note?.length) {
      const notes = Array.isArray(note)
        ? note
        : [
          note,
        ];
      for (let note of notes) {
        const response = await this.createTicketNote({
          $,
          id,
          data: {
            text: note,
            detailDescriptionFlag: true,
          },
        });
        createdNotes.push(response);
      }
    }
    const amountNotes = createdNotes.length;
    $.export("$summary", `Successfully created ticket (ID: ${id})${amountNotes
      ? ` and added ${amountNotes} notes`
      : ""}`);
    return {
      ...(amountNotes
        ? {
          createdNotes,
        }
        : undefined),
      ...response,
    };
  },
};
