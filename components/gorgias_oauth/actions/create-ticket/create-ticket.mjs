import base from "../../../gorgias/actions/create-ticket/create-ticket.mjs";
import overrideApp from "../../common/override-app.mjs";

overrideApp(base);

// same version as base
// eslint-disable-next-line pipedream/required-properties-version
export default {
  ...base,
  key: "gorgias_oauth-create-ticket",
  name: "Create Ticket",
  description: "Create a new ticket. [See the docs](https://developers.gorgias.com/reference/post_api-tickets)",
  type: "action",
};
