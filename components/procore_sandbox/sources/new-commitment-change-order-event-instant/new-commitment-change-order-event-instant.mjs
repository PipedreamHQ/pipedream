import component from "@pipedream/procore/sources/new-commitment-change-order-event-instant/new-commitment-change-order-event-instant.mjs";
import utils from "../../common/utils.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */

export default {
  ...component,
  ...utils.getAppProps(component),
  key: "procore_sandbox-new-commitment-change-order-event-instant",
  description: "Emit new event when a new commitment change order event is created. [See the documentation](https://developers.procore.com/reference/rest/hooks?version=latest).",
  version: "0.0.2",
};
