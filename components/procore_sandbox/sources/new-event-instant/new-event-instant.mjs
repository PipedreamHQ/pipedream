import component from "@pipedream/procore/sources/new-event-instant/new-event-instant.mjs";
import utils from "../../common/utils.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */

export default {
  ...component,
  ...utils.getAppProps(component),
  key: "procore_sandbox-new-event-instant",
  description: "Emit new event depending on the resource name selected. [See the documentation](https://developers.procore.com/reference/rest/hooks?version=latest).",
  version: "0.0.2",
};
