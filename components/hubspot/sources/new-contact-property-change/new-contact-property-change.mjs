import common from "../common.mjs";
import { API_PATH } from "../../common/constants.mjs";

export default {
  ...common,
  key: "hubspot-new-contact-property-change",
  name: "New Contact Property Change",
  description: "Emit new event when a specified property is provided or updated on a contact. [See the docs here](https://developers.hubspot.com/docs/api/crm/contacts)",
  version: "0.0.3",
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
      const updatedContacts = [];
      do {
        const {
          results, paging,
        } = await this.hubspot.searchCRM(params);
        updatedContacts.push(...results);
        if (paging) {
          params.after = paging.next.after;
        } else {
          delete params.after;
        }
      } while (params.after);

      if (!updatedContacts.length) {
        return;
      }

      const inputs = updatedContacts.map(({ id }) => ({
        id,
      }));
      // get contacts w/ `propertiesWithHistory`
      const { results } = await this.batchGetContacts(inputs);

      let maxTs = after;
      for (const result of results) {
        if (this.isRelevant(result, after)) {
          this.emitEvent(result);
          const ts = this.getTs(result);
          if (ts > maxTs) {
            maxTs = ts;
          }
        }
      }

      this._setAfter(maxTs);
    },
  },
};
