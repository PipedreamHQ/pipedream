import base from "./base.mjs";
import { contactSummaryName } from "../../common/utils.mjs";

const MAX_IDS_PER_REQUEST = 500;

// Maps each fetched record to the webhook payload it came from: the payload's
// MessageId and the contact's entry, which reflects the contact as of the event
// rather than whatever it looks like by the time it is fetched.
const eventContexts = new WeakMap();

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
      const entries = new Map(body.Contacts.map((entry) => [
        entry.ContactId,
        entry,
      ]));
      for (const record of records) {
        eventContexts.set(record, {
          messageId: body.MessageId,
          payloadContact: entries.get(record.ContactId) ?? {},
        });
      }
      return records;
    },
    /**
     * The webhook payload's `MessageId` and the contact's entry in it, for a fetched record.
     */
    getEventContext(record) {
      return eventContexts.get(record) ?? {
        payloadContact: {},
      };
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
