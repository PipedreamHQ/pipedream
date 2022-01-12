import common from "./base.mjs";

export default {
  ...common,
  methods: {
    ...common.methods,
    getTriggerPayload() {
      return {
        ticketId: "{{ticket.id}}",
        title: "{{ticket.title}}",
        description: "{{ticket.description}}",
        url: "{{ticket.url}}",
        requester: "{{ticket.requester.first_name}} {{ticket.requester.last_name}} <{{ticket.requester.email}}>",
        assignee: "{{ticket.assignee.first_name}} {{ticket.assignee.last_name}} <{{ticket.assignee.email}}>",
        status: "{{ticket.status}}",
        createdAt: "{{ticket.created_at_with_timestamp}}",
        updatedAt: "{{ticket.updated_at_with_timestamp}}",
      };
    },
  },
};
