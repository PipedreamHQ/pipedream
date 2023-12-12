import common from "../common.mjs";

export default {
  ...common,
  key: "zoho_desk-new-ticket-attachment",
  name: "New Ticket Attachment",
  description: "Emit new event when a new ticket attachment is created. [See the docs here](https://desk.zoho.com/DeskAPIDocument#TicketAttachments#TicketAttachments_Listticketattachments)",
  type: "source",
  version: "0.0.2",
  dedupe: "unique",
  props: {
    ...common.props,
    orgId: {
      propDefinition: [
        common.props.zohoDesk,
        "orgId",
      ],
    },
    ticketId: {
      propDefinition: [
        common.props.zohoDesk,
        "ticketId",
        ({ orgId }) => ({
          orgId,
        }),
      ],
    },
  },
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.zohoDesk.getTicketAttachments;
    },
    getResourceFnArgs() {
      return {
        ticketId: this.ticketId,
        headers: {
          orgId: this.orgId,
        },
        params: {
          sortBy: "createdTime",
        },
      };
    },
    resourceFilter(resource) {
      const lastCreatedAt = this.getLastCreatedAt() || 0;
      return Date.parse(resource.createdTime) > lastCreatedAt;
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        ts: Date.parse(resource.createdTime),
        summary: `Ticket Attachment ID ${resource.id}`,
      };
    },
  },
};
