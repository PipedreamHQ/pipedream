import base from "../../../gorgias/sources/ticket-message-created/ticket-message-created.mjs";
import overrideApp from "../../common/override-app.mjs";

overrideApp(base);

// eslint-disable-next-line pipedream/required-properties-version
export default {
  ...base,
  key: "gorgias_oauth-ticket-messaged-created",
  name: "New Ticket Message",
  description: "Emit new event when a ticket message is created. [See the docs](https://developers.gorgias.com/reference/the-event-object)",
  type: "source",
};
