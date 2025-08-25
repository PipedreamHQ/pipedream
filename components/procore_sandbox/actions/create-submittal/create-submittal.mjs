import component from "@pipedream/procore/actions/create-submittal/create-submittal.mjs";
import utils from "../../common/utils.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */

export default {
  ...component,
  ...utils.getAppProps(component),
  key: "procore_sandbox-create-submittal",
  description: "Create a new submittal. [See the documentation](https://developers.procore.com/reference/rest/submittals?version=latest#create-submittal).",
  version: "0.0.2",
};
