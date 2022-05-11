import base from "../../../gorgias/sources/ticket-message-created/ticket-message-created.mjs";

export default {
  ...base,
  key: "gorgias_oauth-ticket-messaged-created",
  name: "New Ticket Message",
  description: "Emit new event when a ticket message is created. [See the docs](https://developers.gorgias.com/reference/the-event-object)",
  version: "0.0.1",
  type: "source",
};
