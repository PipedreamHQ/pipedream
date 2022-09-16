import common from "../common.mjs";

export default {
  ...common,
  key: "zoho_desk-updated-ticket",
  name: "New Updated Ticket",
  description: "Emit new event when a ticket is updated. [See the docs here](https://desk.zoho.com/DeskAPIDocument#Tickets#Tickets_Listalltickets)",
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
  },
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.zohoDesk.getTickets;
    },
    getResourceFnArgs() {
      return {
        headers: {
          orgId: this.orgId,
        },
        params: {
          sortBy: "customerResponseTime", // responseDueDate | customerResponseTime | createdTime | ticketNumber
        },
      };
    },
    resourceFilter(resource) {
      const lastUpdatedAt = this.getLastUpdatedAt() || 0;
      return Date.parse(resource.customerResponseTime) > lastUpdatedAt;
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        ts: Date.parse(resource.customerResponseTime),
        summary: `Ticket ID ${resource.id}`,
      };
    },
  },
};
