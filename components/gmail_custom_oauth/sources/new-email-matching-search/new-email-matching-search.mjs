import base from "../../../gmail/sources/new-email-matching-search/new-email-matching-search.mjs";
import overrideApp from "../../common/override-app.mjs";

overrideApp(base);

export default {
  ...base,
  key: "gmail_custom_oauth-new-email-matching-search",
  name: "New Email Matching Search",
  description: "Emit new event when an email matching the search criteria is received. This source is capped at 100 max new messages per run.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
};
