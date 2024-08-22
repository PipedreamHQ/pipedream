/* eslint-disable pipedream/required-properties-name */
/* eslint-disable pipedream/required-properties-description */
import sampleEmit from "./test-event.mjs";
import base from "../../../gmail/sources/new-labeled-email/new-labeled-email.mjs";
import overrideApp from "../../common/override-app.mjs";

overrideApp(base);

export default {
  ...base,
  key: "gmail_custom_oauth-new-labeled-email",
  type: "source",
  version: "0.0.9",
  dedupe: "unique",
  sampleEmit,
};
