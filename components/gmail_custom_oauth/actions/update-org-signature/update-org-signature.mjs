/* eslint-disable pipedream/required-properties-name */
/* eslint-disable pipedream/required-properties-description */
/* eslint-disable pipedream/required-properties-type */
import base from "../../../gmail/actions/update-org-signature/update-org-signature.mjs";
import overrideApp from "../../common/override-app.mjs";

overrideApp(base);

export default {
  ...base,
  key: "gmail_custom_oauth-update-org-signature",
  version: "0.0.9",
  type: "action",
};
