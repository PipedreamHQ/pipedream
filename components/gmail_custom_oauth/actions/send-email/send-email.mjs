/* eslint-disable pipedream/required-properties-name */
/* eslint-disable pipedream/required-properties-description */
/* eslint-disable pipedream/required-properties-version */
/* eslint-disable pipedream/required-properties-type */
import base from "../../../gmail/actions/send-email/send-email.mjs";
import overrideApp from "../../common/override-app.mjs";

overrideApp(base);

export default {
  ...base,
  key: "gmail_custom_oauth-send-email",
  version: "0.0.2",
};
