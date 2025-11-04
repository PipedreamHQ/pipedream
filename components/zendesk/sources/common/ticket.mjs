import common from "./webhook.mjs";

export default {
  ...common,
  methods: {
    ...common.methods,
    convertToCamelCase(str) {
      return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(match, index) {
        return index === 0
          ? match.toLowerCase()
          : match.toUpperCase();
      }).replace(/\s+/g, "");
    },
    async getTriggerPayload() {
      if (this.jsonBody) {
        return JSON.parse(this.jsonBody);
      }
      if (this.fields?.length) {
        const payload = {
          ticketId: "{{ticket.id}}",
          createdAt: "{{ticket.created_at_with_timestamp}}",
          updatedAt: "{{ticket.updated_at_with_timestamp}}",
        };
        const { ticket_fields: customFields } = await this.app.listTicketFields();
        for (const field of this.fields) {
          const key = this.convertToCamelCase(field?.label || field);
          if (field?.value) {
            payload[key] = field.value;
          } else {
            const fieldId = customFields.find(({ title }) => title === field)?.id;
            payload[key] = `{{ticket.ticket_field_${fieldId}}}`;
          }
        }
        return payload;
      }
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
