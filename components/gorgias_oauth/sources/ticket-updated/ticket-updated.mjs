import base from "../../../gorgias/sources/ticket-updated/ticket-updated.mjs";

export default {
  ...base,
  key: "gorgias_oauth-ticket-updated",
  name: "New Updated Ticket",
  description: "Emit new event when a ticket is updated. [See the docs](https://developers.gorgias.com/reference/the-event-object)",
  version: "0.0.1",
  type: "source",
};
