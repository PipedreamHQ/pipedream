import common from "../common/base-polling.mjs";

export default {
  ...common,
  key: "chargekeep-new-contact-created",
  name: "New Contact Created",
  description: "Emit new event when a new contact is created. [See the documentation](https://crm.chargekeep.com/app/api/swagger)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async getResults() {
      let { result } = await this.chargekeep.listContacts({
        params: {
          TopCount: 99999,
          IncludeProspective: true,
        },
      });
      result = result.filter(({ typeId }) => typeId === "P");
      return {
        result,
      };
    },
    generateMeta(contact) {
      return {
        id: contact.id,
        summary: `New Contact: ${contact.personName || contact.companyName || contact.id}`,
        ts: Date.now(),
      };
    },
  },
};
