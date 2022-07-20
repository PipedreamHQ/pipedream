import base from "../../../gorgias/sources/ticket-created/ticket-created.mjs";
import overrideApp from "../../common/override-app.mjs";

overrideApp(base);

// eslint-disable-next-line pipedream/required-properties-version
export default {
  ...base,
  key: "gorgias_oauth-ticket-created",
  name: "New Ticket",
  description: "Emit new event when a ticket is created. [See the docs](https://developers.gorgias.com/reference/the-event-object)",
  type: "source",
};
