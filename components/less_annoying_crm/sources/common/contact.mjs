import base from "./base.mjs";
import { contactSummaryName } from "../../common/utils.mjs";

const MAX_IDS_PER_REQUEST = 500;

export default {
  ...base,
  methods: {
    ...base.methods,
    async fetchRecords(body) {
      const contactIds = body.Contacts?.map(({ ContactId }) => ContactId);
      if (!contactIds?.length) {
        return [];
      }
      // GetContactsById returns at most 500 contacts per call, so batch the IDs.
      const records = [];
      for (let i = 0; i < contactIds.length; i += MAX_IDS_PER_REQUEST) {
        const { Results } = await this.app.getContactsById({
          parameters: {
            ContactIds: contactIds.slice(i, i + MAX_IDS_PER_REQUEST),
          },
        });
        records.push(...Results);
      }
      return records;
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
