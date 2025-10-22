import { DEFAULT_LIMIT } from "../../common/constants.mjs";
import common from "../common/common.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "hubspot-new-contact-property-change",
  name: "New Contact Property Change",
  description:
    "Emit new event when a specified property is provided or updated on a contact. [See the documentation](https://developers.hubspot.com/docs/api/crm/contacts)",
  version: "0.0.32",
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
    skipFirstRun: {
      type: "boolean",
      label: "Skip existing contacts when first activated",
      description:
        "When enabled, this trigger will ignore all existing contacts and only watch for property changes that happen after activation. When disabled, it will process all existing contacts on first run.",
      optional: true,
      default: false,
    },
    requirePropertyHistory: {
      type: "boolean",
      label: "Only trigger on actual property changes",
      description:
        "When enabled, only fires when a contact property is actually modified. When disabled, may also trigger for newly created contacts even if the property wasn't changed.",
      optional: true,
      default: true,
    },
    fetchAllProperties: {
      type: "boolean",
      label: "Fetch all contact properties",
      description:
        "When enabled, fetches all available contact properties instead of just the watched property. This provides complete contact data but may increase API usage.",
      optional: true,
      default: false,
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
        id, properties,
      } = contact;
      const ts = this.getTs(contact);
      return {
        id: `${id}${ts}`,
        summary: properties[this.property],
        ts,
      };
    },
    isRelevant(contact, updatedAfter) {
      if (this.requirePropertyHistory) {
        const history = contact.propertiesWithHistory?.[this.property];
        if (!history || history.length === 0) {
          return false;
        }

        const propertyTimestamp = history[0].timestamp;
        const createDate = contact.properties.createdate;

        if (propertyTimestamp === createDate) {
          return false;
        }
      }

      return this.getTs(contact) > updatedAfter;
    },
    getParams(after) {
      const params = {
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
              ],
            },
          ],
        },
      };
      if (after) {
        params.data.filterGroups[0].filters.push({
          propertyName: "lastmodifieddate",
          operator: "GTE",
          value: after,
        });
      }
      return params;
    },
    async batchGetContacts(inputs) {
      if (this.fetchAllProperties) {
        const { results } = await this.hubspot.batchGetContactsWithAllProperties({
          contactIds: inputs.map((input) => input.id),
        });

        const { results: contactsWithHistory } = await this.hubspot.batchGetObjects({
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

        const mergedResults = results.map((contact) => {
          const contactWithHistory = contactsWithHistory.find((c) => c.id === contact.id);
          return {
            ...contact,
            propertiesWithHistory: contactWithHistory?.propertiesWithHistory || {},
          };
        });

        return {
          results: mergedResults,
        };
      }

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
      if (this.skipFirstRun && !after) {
        this._setAfter(Date.now());
        return;
      }

      const properties = await this.hubspot.getContactProperties();
      const propertyNames = properties.map((property) => property.name);
      if (!propertyNames.includes(this.property)) {
        throw new Error(
          `Property "${this.property}" not supported for Contacts. See Hubspot's default contact properties documentation - https://knowledge.hubspot.com/contacts/hubspots-default-contact-properties`,
        );
      }

      const updatedContacts = await this.getPaginatedItems(
        this.hubspot.searchCRM,
        params,
        after,
      );

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
