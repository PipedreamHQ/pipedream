import base from "../common/base.mjs";
import eventTypes from "../common/event-types.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...base,
  key: "gorgias_oauth-internal-note-created",
  name: "New Internal Note",
  description: "Emit new event when an internal note is created on a ticket. [See the documentation](https://developers.gorgias.com/reference/the-event-object)",
  version: "0.0.4",
  type: "source",
  props: {
    ...base.props,
    ticketId: {
      propDefinition: [
        base.props.gorgias_oauth,
        "ticketId",
      ],
      optional: true,
    },
    sender: {
      type: "string",
      label: "Sender Email",
      description: "Email address of the sender",
      optional: true,
    },
  },
  hooks: {
    ...base.hooks,
    deploy() {},
  },
  methods: {
    ...base.methods,
    /**
     * Get the event type for internal notes
     * @returns {string} The event type
     */
    getEventType() {
      return eventTypes.TICKET_MESSAGE_CREATED;
    },
    /**
     * Check if a message is relevant for this source
     * @param {object} message - The message object
     * @returns {boolean} Whether the message is relevant
     */
    isRelevant(message) {
      return message.source.type === "internal-note"
        && (!this.ticketId || message.ticket_id === this.ticketId)
        && (!this.sender || message.sender?.email === this.sender);
    },
    /**
     * Process and emit relevant events
     * @param {object} event - The incoming event
     */
    async processEvent(event) {
      const { message } = event;
      if (this.isRelevant(message)) {
        this.emitEvent(message);
      }
    },
  },
  sampleEmit,
};
