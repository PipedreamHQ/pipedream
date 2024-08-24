import base from "../../../gmail/sources/new-email-received/new-email-received.mjs";
import overrideApp from "../../common/override-app.mjs";

overrideApp(base);

export default {
  ...base,
  key: "gmail_custom_oauth-new-email-received",
  name: "New Email Received",
  description: "Emit new event when a new email is received.",
  type: "source",
  version: "0.0.13",
  dedupe: "unique",
};
