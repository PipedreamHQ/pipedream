import base from "../common/base.mjs";
import eventTypes from "../common/event-types.mjs";

export default {
  ...base,
  key: "gorgias-ticket-messaged-created",
  name: "New Ticket Message",
  description: "Emit new event when a ticket message is created. [See the docs](https://developers.gorgias.com/reference/the-event-object)",
  version: "0.0.1",
  type: "source",
  methods: {
    ...base.methods,
    getEventType() {
      return eventTypes.TICKET_MESSAGE_CREATED;
    },
    getData() {
      return {
        messages: "{{ ticket.messages }}",
      };
    },
  },
  async run(event) {
    console.log("Raw received event:");
    console.log(event);
    // Have to convert python dict to JS
    const messages = event.query.messages
      .replace(/'/g, "\"")
      .replace(/True/g, "true")
      .replace(/False/g, "false");
    console.log("Extracting latest message:");
    const message = JSON.parse(messages).pop();
    const { created_datetime: createdAt } = message;
    this.emitEvent(message, createdAt);
  },
};
