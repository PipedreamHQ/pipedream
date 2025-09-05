import component from "@pipedream/procore/actions/create-rfi/create-rfi.mjs";
import utils from "../../common/utils.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */

export default {
  ...component,
  ...utils.getAppProps(component),
  key: "procore_sandbox-create-rfi",
  description: "Create a new RFI. [See the documentation](https://developers.procore.com/reference/rest/rfis?version=latest#create-rfi).",
  version: "0.0.2",
};
