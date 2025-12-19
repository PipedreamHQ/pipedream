import common from "../common/common-polling.mjs";

export default {
  ...common,
  key: "zoho_desk-new-ticket-message",
  name: "New Ticket Message",
  description: "Emit new event when a message ticket is created. [See the docs here](https://desk.zoho.com/DeskAPIDocument#Threads#Threads_Listallthreads)",
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
    ticketId: {
      propDefinition: [
        common.props.zohoDesk,
        "ticketId",
      ],
    },
    direction: {
      type: "string",
      label: "Direction",
      description: "Key that returns whether the thread (message) is incoming or outgoing",
      options: [
        {
          label: "Incoming",
          value: "in",
        },
        {
          label: "Outgoing",
          value: "out",
        },
      ],
    },
  },
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.zohoDesk.getTicketThreads;
    },
    getResourceFnArgs() {
      return {
        ticketId: this.ticketId,
        headers: {
          orgId: this.orgId,
        },
      };
    },
    resourceFilter(resource) {
      const lastCreatedAt = this.getLastCreatedAt() || 0;
      const checkDirection = resource.direction === this.direction;
      return checkDirection
        && Date.parse(resource.createdTime) > lastCreatedAt;
    },
    generateMeta(resource) {
      const ts = Date.parse(resource.createdTime);
      return {
        id: `${resource.id}-${ts}`,
        ts,
        summary: `Thread ID ${resource.id}`,
      };
    },
  },
};
