/* eslint-disable pipedream/required-properties-name */
/* eslint-disable pipedream/required-properties-description */
import base from "../../../gmail/sources/new-sent-email/new-sent-email.mjs";
import overrideApp from "../../common/override-app.mjs";

overrideApp(base);

export default {
  ...base,
  key: "gmail_custom_oauth-new-sent-email",
  version: "0.0.8",
  type: "source",
};
