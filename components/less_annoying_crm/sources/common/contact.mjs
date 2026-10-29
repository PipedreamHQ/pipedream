import base from "./base.mjs";
import { contactSummaryName } from "../../common/utils.mjs";

export default {
  ...base,
  methods: {
    ...base.methods,
    async fetchRecords(body) {
      const ContactIds = body.Contacts?.map(({ ContactId }) => ContactId);
      if (!ContactIds?.length) {
        return [];
      }
      const { Results } = await this.app.getContactsById({
        parameters: {
          ContactIds,
        },
      });
      return Results;
    },
    getDedupeId(contact) {
      return contact.ContactId;
    },
    getAction() {
      throw new Error("getAction is not implemented");
    },
    generateMeta(contact) {
      return {
        id: this.getDedupeId(contact),
        summary: `${contact.IsCompany
          ? "Company"
          : "Contact"} ${this.getAction()}: ${contactSummaryName(contact)}`,
        ts: Date.parse(contact.LastUpdate ?? contact.DateCreated) || Date.now(),
      };
    },
  },
};
