import base from "../../../gorgias/sources/ticket-updated/ticket-updated.mjs";
import overrideApp from "../../common/override-app.mjs";

overrideApp(base);

// eslint-disable-next-line pipedream/required-properties-version
export default {
  ...base,
  key: "gorgias_oauth-ticket-updated",
  name: "New Updated Ticket",
  description: "Emit new event when a ticket is updated. [See the docs](https://developers.gorgias.com/reference/the-event-object)",
  type: "source",
};
