/* eslint-disable pipedream/required-properties-name */
/* eslint-disable pipedream/required-properties-description */
/* eslint-disable pipedream/required-properties-type */
import base from "../../../gmail/actions/download-attachment/download-attachment.mjs";
import overrideApp from "../../common/override-app.mjs";

overrideApp(base);

export default {
  ...base,
  key: "gmail_custom_oauth-download-attachment",
  version: "0.0.7",
  type: "action",
};
