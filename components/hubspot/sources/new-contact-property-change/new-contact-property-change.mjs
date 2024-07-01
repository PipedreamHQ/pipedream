import common from "../common/common.mjs";
import { DEFAULT_LIMIT } from "../../common/constants.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "hubspot-new-contact-property-change",
  name: "New Contact Property Change",
  description: "Emit new event when a specified property is provided or updated on a contact. [See the documentation](https://developers.hubspot.com/docs/api/crm/contacts)",
  version: "0.0.9",
  dedupe: "unique",
  type: "source",
  props: {
    ...common.props,
    property: {
      type: "string",
      label: "Property",
      description: "The contact property to watch for changes",
      async options() {
        const properties = await this.hubspot.getContactProperties();
        return properties.map((property) => property.name);
      },
    },
  },
  methods: {
    ...common.methods,
    getTs(contact) {
      const history = contact.propertiesWithHistory[this.property];
      if (!history || !(history.length > 0)) {
        return;
      }
      return Date.parse(history[0].timestamp);
    },
    generateMeta(contact) {
      const {
        id,
        properties,
      } = contact;
      const ts = this.getTs(contact);
      return {
        id: `${id}${ts}`,
        summary: properties[this.property],
        ts,
      };
    },
    isRelevant(contact, updatedAfter) {
      return !updatedAfter || this.getTs(contact) > updatedAfter;
    },
    getParams(after) {
      return {
        object: "contacts",
        data: {
          limit: DEFAULT_LIMIT,
          properties: [
            this.property,
          ],
          sorts: [
            {
              propertyName: "lastmodifieddate",
              direction: "DESCENDING",
            },
          ],
          filterGroups: [
            {
              filters: [
                {
                  propertyName: this.property,
                  operator: "HAS_PROPERTY",
                },
                {
                  propertyName: "lastmodifieddate",
                  operator: "GTE",
                  value: after,
                },
              ],
            },
          ],
        },
      };
    },
    batchGetContacts(inputs) {
      return this.hubspot.batchGetObjects({
        objectType: "contacts",
        data: {
          properties: [
            this.property,
          ],
          propertiesWithHistory: [
            this.property,
          ],
          inputs,
        },
      });
    },
    async processResults(after, params) {
      const properties = await this.hubspot.getContactProperties();
      const propertyNames = properties.map((property) => property.name);
      if (!propertyNames.includes(this.property)) {
        throw new Error(`Property "${this.property}" not supported for Contacts. See Hubspot's default contact properties documentation - https://knowledge.hubspot.com/contacts/hubspots-default-contact-properties`);
      }

      const updatedContacts = await this.getPaginatedItems(this.hubspot.searchCRM, params);

      if (!updatedContacts.length) {
        return;
      }

      const results = await this.processChunks({
        batchRequestFn: this.batchGetContacts,
        chunks: this.getChunks(updatedContacts),
      });

      this.processEvents(results, after);
    },
  },
  sampleEmit,
};
