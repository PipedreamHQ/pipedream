import common from "../common/common.mjs";
import {
  DEFAULT_LIMIT,
  DEFAULT_CONTACT_PROPERTIES,
} from "../../common/constants.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "hubspot-new-contact-added-to-list",
  name: "New Contact Added to List",
  description:
    "Emit new event when a contact is added to a HubSpot list. [See the documentation](https://developers.hubspot.com/docs/reference/api/crm/lists#get-%2Fcrm%2Fv3%2Flists%2F%7Blistid%7D%2Fmemberships%2Fjoin-order)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    info: {
      type: "alert",
      alertType: "info",
      content: `Properties:\n\`${DEFAULT_CONTACT_PROPERTIES.join(", ")}\``,
    },
    lists: {
      propDefinition: [
        common.props.hubspot,
        "lists",
      ],
      description: "Select the lists to watch for new contacts.",
      optional: false,
    },
    properties: {
      propDefinition: [
        common.props.hubspot,
        "contactProperties",
        () => ({
          excludeDefaultProperties: true,
        }),
      ],
      label: "Additional contact properties to retrieve",
      optional: true,
    },
  },
  methods: {
    ...common.methods,
    _getAfterToken(listId) {
      const key = `list_${listId}_after_token`;
      return this.db.get(key);
    },
    _setAfterToken(listId, afterToken) {
      const key = `list_${listId}_after_token`;
      this.db.set(key, afterToken);
    },
    _getLastRecordId(listId) {
      const key = `list_${listId}_last_record_id`;
      return this.db.get(key);
    },
    _setLastRecordId(listId, recordId) {
      const key = `list_${listId}_last_record_id`;
      this.db.set(key, recordId);
    },
    getTs() {
      return Date.now();
    },
    generateMeta(membership, listInfo) {
      const { recordId } = membership;
      const ts = this.getTs();

      return {
        id: `${listInfo.listId}-${recordId}`,
        summary: `Contact ${recordId} added to list: ${listInfo.name}`,
        ts,
      };
    },
    async getContactDetails(contactIds) {
      if (!contactIds.length) return {};

      const uniqueContactIds = [
        ...new Set(contactIds),
      ];

      const { properties = [] } = this;
      const allProperties = [
        ...new Set([
          ...DEFAULT_CONTACT_PROPERTIES,
          ...properties,
        ]),
      ];

      const chunks = [];
      const chunkSize = 100;
      for (let i = 0; i < uniqueContactIds.length; i += chunkSize) {
        chunks.push(uniqueContactIds.slice(i, i + chunkSize));
      }

      const contactMap = {};

      const chunkPromises = chunks.map(async (chunk) => {
        try {
          const { results } = await this.hubspot.batchGetObjects({
            objectType: "contacts",
            data: {
              inputs: chunk.map((id) => ({
                id,
              })),
              properties: allProperties,
            },
          });
          return results;
        } catch (error) {
          console.warn("Error fetching contact details for chunk:", error);
          return [];
        }
      });

      try {
        const chunkResults = await Promise.all(chunkPromises);

        chunkResults.forEach((results) => {
          results.forEach((contact) => {
            contactMap[contact.id] = contact;
          });
        });

        return contactMap;
      } catch (error) {
        console.warn("Error processing contact details:", error);
        return {};
      }
    },
    async processListMemberships(listId, listInfo) {
      const afterToken = this._getAfterToken(listId);
      const lastRecordId = this._getLastRecordId(listId);
      const newMemberships = [];

      let params = {
        limit: DEFAULT_LIMIT,
      };

      if (afterToken) {
        params.after = afterToken;
      }

      try {
        let hasMore = true;
        let latestAfterToken = afterToken;
        let latestRecordId = lastRecordId;

        while (hasMore) {
          const {
            results, paging,
          } =
            await this.hubspot.getListMembershipsByJoinOrder({
              listId,
              params,
            });

          if (!results || results.length === 0) {
            break;
          }

          for (const membership of results) {
            if (lastRecordId && membership.recordId === lastRecordId) {
              continue;
            }

            newMemberships.push({
              membership,
              listInfo,
            });
            latestRecordId = membership.recordId;
          }

          if (paging?.next?.after) {
            latestAfterToken = paging.next.after;
            params.after = paging.next.after;
          } else {
            hasMore = false;
          }
        }

        if (latestAfterToken !== afterToken) {
          this._setAfterToken(listId, latestAfterToken);
        }
        if (latestRecordId) {
          this._setLastRecordId(listId, latestRecordId);
        }
      } catch (error) {
        console.error(`Error processing list ${listId}:`, error);
      }

      return newMemberships;
    },
    async processResults() {
      const { lists } = this;

      if (!lists || lists.length === 0) {
        console.warn("No lists selected to monitor");
        return;
      }

      const allNewMemberships = [];

      for (const listId of lists) {
        try {
          const listInfo = {
            listId,
            name: `List ${listId}`,
          };

          const newMemberships = await this.processListMemberships(
            listId,
            listInfo,
          );
          allNewMemberships.push(...newMemberships);
        } catch (error) {
          console.error(`Error processing list ${listId}:`, error);
        }
      }

      if (allNewMemberships.length > 0) {
        const contactIds = allNewMemberships.map(
          ({ membership }) => membership.recordId,
        );
        const contactDetails = await this.getContactDetails(contactIds);

        for (const {
          membership, listInfo,
        } of allNewMemberships) {
          const contactDetail = contactDetails[membership.recordId] || {};

          const eventData = {
            listId: listInfo.listId,
            listName: listInfo.name,
            contactId: membership.recordId,
            contact: contactDetail,
            membership,
            addedAt: new Date().toISOString(),
          };

          const meta = this.generateMeta(membership, listInfo);
          this.$emit(eventData, meta);
        }
      }
    },
    getParams() {
      return {};
    },
  },
  sampleEmit,
};
