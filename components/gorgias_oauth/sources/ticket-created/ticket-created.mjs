import base from "../common/base.mjs";
import eventTypes from "../common/event-types.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...base,
  key: "gorgias_oauth-ticket-created",
  name: "New Ticket",
  description: "Emit new event when a ticket is created. [See the docs](https://developers.gorgias.com/reference/the-event-object)",
  version: "0.1.4",
  type: "source",
  props: {
    ...base.props,
    channel: {
      propDefinition: [
        base.props.gorgias_oauth,
        "channel",
      ],
    },
    via: {
      propDefinition: [
        base.props.gorgias_oauth,
        "via",
      ],
    },
    assigneeId: {
      propDefinition: [
        base.props.gorgias_oauth,
        "userId",
      ],
    },
  },
  methods: {
    ...base.methods,
    getEventType() {
      return eventTypes.TICKET_CREATED;
    },
    isRelevant(ticket) {
      return (!this.channel || ticket.channel === this.channel)
        && (!this.via || ticket.via === this.via)
        && (!this.assigneeId || ticket.assignee_user.id === this.assigneeId);
    },
    async processHistoricalEvent(event) {
      const ticket = await this.retrieveTicket(event.object_id);
      return {
        ticket,
      };
    },
    async processEvent(event) {
      const { ticket } = event; console.log(ticket);
      if (this.isRelevant(ticket)) {
        this.emitEvent(ticket);
      }
    },
  },
  sampleEmit,
};
