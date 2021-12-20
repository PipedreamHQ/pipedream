import common from "../common.mjs";

export default {
  ...common,
  name: "Solved Ticket",
  key: "zendesk-solved-ticket",
  type: "source",
  description: "Emit new event when a ticket is solved",
  version: "0.0.1",
  methods: {
    ...common.methods,
    getWebhookName() {
      return "Solved Ticket Webhook";
    },
    getTriggerTitle() {
      return "Solved Ticket Trigger";
    },
    getTriggerConditions() {
      return {
        any: [
          {
            field: "status",
            operator: "is",
            value: "solved",
          },
        ],
      };
    },
    getTriggerPayload() {
      return {
        ticketId: "{{ticket.id}}",
        title: "{{ticket.title}}",
        description: "{{ticket.description}}",
        url: "{{ticket.url}}",
        requester: "{{ticket.requester.first_name}} {{ticket.requester.last_name}} <{{ticket.requester.email}}>",
        assignee: "{{ticket.assignee.first_name}} {{ticket.assignee.last_name}} <{{ticket.assignee.email}}>",
        status: "{{ticket.status}}",
        createdAt: "{{ticket.created_at}}",
        updatedAt: "{{ticket.updated_at}}",
      };
    },
  },
  async run(event) {
    const payload = event.body;

    this.$emit(payload, {
      id: payload.ticketId,
      summary: JSON.stringify(payload),
      ts: Date.parse(payload.updatedAt),
    });
  },
};
