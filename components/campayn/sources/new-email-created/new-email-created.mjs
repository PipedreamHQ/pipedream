import common from "../common/common.mjs";

export default {
  ...common,
  key: "campayn-new-email-created",
  name: "New Email Created",
  description: "Emit new events when a new email is created. [See the docs](https://github.com/nebojsac/Campayn-API/blob/master/endpoints/emails.md#get-emails)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async getResources() {
      return this.campayn.listEmails();
    },
    generateMeta(email) {
      return {
        id: email.id,
        summary: email.name,
        ts: Date.now(),
      };
    },
  },
};
