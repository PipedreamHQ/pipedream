import common from "../common/base.mjs";

export default {
  ...common,
  key: "sitecreator_io-new-newsletter-contact-created",
  name: "New Newsletter Contact Created",
  description: "Emit new event when a new newsletter contact is added to a website. [See the docs here](http://api-doc.sitecreator.io/#tag/Contact/operation/getLeads)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async getResources() {
      return this.sitecreator.getNewsletter({
        data: {
          siteId: this.siteId,
        },
      });
    },
    generateMeta(contact) {
      return {
        id: contact.id,
        summary: `New Newsletter Contact ID ${contact.id}`,
        ts: Date.now(),
      };
    },
  },
};
