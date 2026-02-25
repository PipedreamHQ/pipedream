import constants from "../../common/constants.mjs";
import base from "../common/base.mjs";
import eventTypes from "../common/event-types.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...base,
  key: "gorgias_oauth-ticket-message-created",
  name: "New Ticket Message",
  description: "Emit new event when a ticket message is created. [See the documentation](https://developers.gorgias.com/reference/the-event-object)",
  version: "0.1.11",
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
    ticketId: {
      propDefinition: [
        base.props.gorgias_oauth,
        "ticketId",
      ],
      optional: true,
    },
    sourceType: {
      type: "string",
      label: "Source Type",
      description: "How the message was sent/received",
      options: constants.sourceTypes,
      optional: true,
    },
    sender: {
      type: "string",
      label: "Sender Email",
      description: "Email address of the sender",
      optional: true,
    },
    receiver: {
      type: "string",
      label: "Receiver Email",
      description: "Email address of the receiver",
      optional: true,
    },
  },
  hooks: {
    ...base.hooks,
    deploy() {},
  },
  methods: {
    ...base.methods,
    getEventType() {
      return eventTypes.TICKET_MESSAGE_CREATED;
    },
    isRelevant(message) {
      return (!this.channel || message.channel === this.channel)
        && (!this.ticketId || message.ticket_id === this.ticketId)
        && (!this.sourceType || message.source.type === this.sourceType)
        && (!this.sender || message.sender.email === this.sender)
        && (!this.receiver || message.receiver.email === this.receiver);
    },
    async processEvent(event) {
      const { message } = event;
      if (this.isRelevant(message)) {
        this.emitEvent(message);
      }
    },
  },
  sampleEmit,
};
