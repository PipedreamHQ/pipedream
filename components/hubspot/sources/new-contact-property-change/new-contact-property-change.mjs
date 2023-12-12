import common from "../common/common.mjs";
import { API_PATH } from "../../common/constants.mjs";

export default {
  ...common,
  key: "hubspot-new-contact-property-change",
  name: "New Contact Property Change",
  description: "Emit new event when a specified property is provided or updated on a contact. [See the docs here](https://developers.hubspot.com/docs/api/crm/contacts)",
  version: "0.0.6",
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
  hooks: {},
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
        limit: 50,
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
      };
    },
    async batchGetContacts(inputs) {
      return this.hubspot.makeRequest(
        API_PATH.CRMV3,
        "/objects/contacts/batch/read",
        {
          method: "POST",
          data: {
            properties: [
              this.property,
            ],
            propertiesWithHistory: [
              this.property,
            ],
            inputs,
          },
        },
      );
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

      const batchSize = 45;
      let maxTs = after;

      for (let i = 0; i < updatedContacts.length; i += batchSize) {
        const batchInputs = updatedContacts.slice(i, i + batchSize).map(({ id }) => ({
          id,
        }));

        // get contacts w/ `propertiesWithHistory`
        const { results } = await this.batchGetContacts(batchInputs);

        maxTs = after;

        for (const result of results) {
          if (this.isRelevant(result, after)) {
            this.emitEvent(result);
            const ts = this.getTs(result);
            if (ts > maxTs) {
              maxTs = ts;
            }
          }
        }

        after = maxTs;
      }

      this._setAfter(maxTs);
    },
  },
};
