import component from "@pipedream/procore/actions/create-incident/create-incident.mjs";
import utils from "../../common/utils.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */

export default {
  ...component,
  ...utils.getAppProps(component),
  key: "procore_sandbox-create-incident",
  description: "Create a new incident. [See the documentation](https://developers.procore.com/reference/rest/incidents?version=latest#create-incident).",
  version: "0.0.2",
};
