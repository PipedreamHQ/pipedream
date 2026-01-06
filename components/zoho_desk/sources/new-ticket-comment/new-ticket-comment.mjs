import common from "../common/common-polling.mjs";

export default {
  ...common,
  key: "zoho_desk-new-ticket-comment",
  name: "New Ticket Comment",
  description: "Emit new event when a new ticket comment is created. [See the docs here](https://desk.zoho.com/DeskAPIDocument#TicketsComments#TicketsComments_Listallticketcomments)",
  type: "source",
  version: "0.0.10",
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
      return this.zohoDesk.getTicketComments;
    },
    getResourceFnArgs() {
      return {
        ticketId: this.ticketId,
        headers: {
          orgId: this.orgId,
        },
        params: {
          sortBy: "commentedTime",
        },
      };
    },
    resourceFilter(resource) {
      const lastCreatedAt = this.getLastCreatedAt() || 0;
      return Date.parse(resource.commentedTime) > lastCreatedAt;
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        ts: Date.parse(resource.commentedTime),
        summary: `Ticket Comment ID ${resource.id}`,
      };
    },
  },
};
