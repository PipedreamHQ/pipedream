import base from "../../../gmail/sources/new-sent-email/new-sent-email.mjs";
import overrideApp from "../../common/override-app.mjs";

overrideApp(base);

export default {
  ...base,
  key: "gmail_custom_oauth-new-sent-email",
  name: "New Sent Email",
  description: "Emit new event for each new email sent. (Maximum of 100 events emitted per execution)",
  version: "0.0.10",
  type: "source",
  dedupe: "unique",
};
