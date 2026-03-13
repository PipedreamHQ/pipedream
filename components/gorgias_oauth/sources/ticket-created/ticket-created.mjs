import base from "../common/base.mjs";
import eventTypes from "../common/event-types.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...base,
  key: "gorgias_oauth-ticket-created",
  name: "New Ticket",
  description: "Emit new event when a ticket is created. [See the documentation](https://developers.gorgias.com/reference/the-event-object)",
  version: "0.2.0",
  type: "source",
  props: {
    ...base.props,
    channel: {
      propDefinition: [
        base.props.gorgias_oauth,
        "channel",
      ],
      default: "",
      description: "The channel used to send the message.",
    },
    via: {
      propDefinition: [
        base.props.gorgias_oauth,
        "via",
      ],
      default: "",
      description: "How the message has been received, or sent from Gorgias.",
    },
    assigneeId: {
      propDefinition: [
        base.props.gorgias_oauth,
        "userId",
      ],
    },
    tagIds: {
      type: "string[]",
      label: "Tag IDs",
      description: "The tag ids to filter tickets by.",
      propDefinition: [
        base.props.gorgias_oauth,
        "tagId",
      ],
    },
  },
  methods: {
    ...base.methods,
    getEventType() {
      return eventTypes.TICKET_CREATED;
    },
    isRelevant(ticket) {
      const tagIds = ticket.tags.map(({ id }) => id);
      return (!this.channel || ticket.channel === this.channel)
        && (!this.via || ticket.via === this.via)
        && (!this.assigneeId || ticket?.assignee_user_id === this.assigneeId)
        && (!this.tagIds || this.tagIds.some((tagId) => tagIds.includes(tagId)));
    },
    async processHistoricalEvent(event) {
      const ticket = await this.retrieveTicket(event.object_id);
      return {
        ticket,
      };
    },
    async processEvent(event) {
      const { ticket } = event;
      if (this.isRelevant(ticket)) {
        const enrichedTicket = await this.enrichTicketWithCustomFields(ticket);
        this.emitEvent(enrichedTicket);
      }
    },
  },
  sampleEmit,
};
