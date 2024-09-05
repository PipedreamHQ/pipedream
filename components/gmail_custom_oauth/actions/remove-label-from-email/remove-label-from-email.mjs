/* eslint-disable pipedream/required-properties-name */
/* eslint-disable pipedream/required-properties-description */
/* eslint-disable pipedream/required-properties-type */
import base from "../../../gmail/actions/remove-label-from-email/remove-label-from-email.mjs";
import overrideApp from "../../common/override-app.mjs";

overrideApp(base);

export default {
  ...base,
  key: "gmail_custom_oauth-remove-label-from-email",
  version: "0.0.1",
  type: "action",
};
