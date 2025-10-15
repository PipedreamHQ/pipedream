import common from "../common/common-polling.mjs";

export default {
  ...common,
  key: "zoho_desk-new-ticket",
  name: "New Ticket",
  description: "Emit new event when a new ticket is created. [See the docs here](https://desk.zoho.com/DeskAPIDocument#Tickets#Tickets_Listalltickets)",
  type: "source",
  version: "0.0.6",
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
          sortBy: "createdTime", // responseDueDate | customerResponseTime | createdTime | ticketNumber
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
        summary: `Ticket ID ${resource.id}`,
      };
    },
  },
};
