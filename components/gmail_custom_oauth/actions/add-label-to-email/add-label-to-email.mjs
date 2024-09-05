/* eslint-disable pipedream/required-properties-name */
/* eslint-disable pipedream/required-properties-description */
/* eslint-disable pipedream/required-properties-type */
import base from "../../../gmail/actions/add-label-to-email/add-label-to-email.mjs";
import overrideApp from "../../common/override-app.mjs";

overrideApp(base);

export default {
  ...base,
  key: "gmail_custom_oauth-add-label-to-email",
  version: "0.0.12",
  type: "action",
};
