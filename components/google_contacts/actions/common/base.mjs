import googleContacts from "../../google_contacts.app.mjs";

export default {
  props: {
    googleContacts,
  },
  async run({ $ }) {
    const client = this.googleContacts.getClient();
    const results = await this.processResults(client);
    this.emitSummary($, results);
    return results;
  },
};
