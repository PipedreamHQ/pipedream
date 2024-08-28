import base from "../../../gmail/sources/new-email-received-instant/new-email-received-instant.mjs";
import overrideApp from "../../common/override-app.mjs";

overrideApp(base);

export default {
  ...base,
  key: "gmail_custom_oauth-new-email-received-instant",
  name: "New Email Received (Instant)",
  description: "Emit new event when a new email is received.",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
};
