import sampleEmit from "./test-event.mjs";
import base from "../../../gmail/sources/new-labeled-email/new-labeled-email.mjs";
import overrideApp from "../../common/override-app.mjs";

overrideApp(base);

export default {
  ...base,
  key: "gmail_custom_oauth-new-labeled-email",
  name: "New Labeled Email",
  description: "Emit new event when a new email is labeled.",
  type: "source",
  version: "0.0.11",
  dedupe: "unique",
  sampleEmit,
};
