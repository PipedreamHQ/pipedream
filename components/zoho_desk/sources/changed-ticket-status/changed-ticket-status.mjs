import common from "../common/common-polling.mjs";

export default {
  ...common,
  key: "zoho_desk-changed-ticket-status",
  name: "New Ticket Status Change",
  description: "Emit new event when a status ticket is changed. [See the docs here](https://desk.zoho.com/DeskAPIDocument#Tickets#Tickets_Listalltickets)",
  type: "source",
  version: "0.0.9",
  dedupe: "unique",
  props: {
    ...common.props,
    orgId: {
      propDefinition: [
        common.props.zohoDesk,
        "orgId",
      ],
    },
    status: {
      propDefinition: [
        common.props.zohoDesk,
        "ticketStatus",
      ],
    },
  },
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.zohoDesk.searchTickets;
    },
    getResourceFnArgs() {
      return {
        headers: {
          orgId: this.orgId,
        },
        params: {
          sortBy: "modifiedTime", // relevance | modifiedTime | createdTime | customerResponseTime
          status: this.status,
        },
      };
    },
    resourceFilter(resource) {
      const lastUpdatedAt = this.getLastUpdatedAt() || 0;
      return Date.parse(resource.modifiedTime) > lastUpdatedAt;
    },
    generateMeta(resource) {
      const ts = Date.parse(resource.modifiedTime);
      return {
        id: `${resource.id}-${ts}`,
        ts,
        summary: `Ticket ID ${resource.id}`,
      };
    },
  },
};
