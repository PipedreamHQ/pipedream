import base from "../../../gorgias/actions/list-tickets/list-tickets.mjs";
import overrideApp from "../../common/override-app.mjs";

overrideApp(base);

export default {
  ...base,
  key: "gorgias_oauth-list-tickets",
  name: "List Tickets",
  description: "List all tickets. [See the docs](https://developers.gorgias.com/reference/get_api-tickets)",
  version: "0.0.1",
  type: "action",
};
