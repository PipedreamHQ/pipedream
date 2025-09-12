import common from "../common/common.mjs";
import {
  DEFAULT_LIMIT,
  DEFAULT_CONTACT_PROPERTIES,
  API_PATH,
} from "../../common/constants.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "hubspot-new-contact-added-to-list",
  name: "New Contact Added to List",
  description:
    "Emit new event when a contact is added to a HubSpot list. [See the documentation](https://developers.hubspot.com/docs/reference/api/crm/lists#get-%2Fcrm%2Fv3%2Flists%2F%7Blistid%7D%2Fmemberships%2Fjoin-order)",
  version: "0.0.3",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    info: {
      type: "alert",
      alertType: "info",
      content: `Properties:\n\`${DEFAULT_CONTACT_PROPERTIES.join(", ")}\``,
    },
    listId: {
      type: "string",
      label: "List ID",
      description: "Select the list to watch for new contacts",
      withLabel: true,
      async options({ page }) {
        const { lists } = await this.searchLists({
          data: {
            count: DEFAULT_LIMIT,
            offset: page * DEFAULT_LIMIT,
          },
        });
        return (
          lists?.map(({
            listId, name,
          }) => ({
            value: listId,
            label: name,
          })) || []
        );
      },
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
    _getKey(listId) {
      return `list_${listId}_last_timestamp`;
    },
    _getLastMembershipTimestamp(listId) {
      return this.db.get(this._getKey(listId));
    },
    _setLastMembershipTimestamp(listId, timestamp) {
      this.db.set(this._getKey(listId), timestamp);
    },
    searchLists(opts = {}) {
      return this.hubspot.makeRequest({
        api: API_PATH.CRMV3,
        method: "POST",
        endpoint: "/lists/search",
        ...opts,
      });
    },
    getTs() {
      return Date.now();
    },
    generateMeta(membership, listInfo) {
      const {
        recordId, membershipTimestamp,
      } = membership;
      const ts = membershipTimestamp
        ? new Date(membershipTimestamp).getTime()
        : this.getTs();

      return {
        id: `${listInfo.listId}-${recordId}-${ts}`,
        summary: `Contact ${recordId} added to list: ${listInfo.name}`,
        ts,
      };
    },
    async getContactDetails(contactIds) {
      if (!contactIds.length) return {};

      const { properties = [] } = this;
      const allProperties = [
        ...DEFAULT_CONTACT_PROPERTIES,
        ...properties,
      ];

      const chunks = [];
      const chunkSize = 100;
      for (let i = 0; i < contactIds.length; i += chunkSize) {
        chunks.push(contactIds.slice(i, i + chunkSize));
      }

      const contactMap = {};

      try {
        for (const chunk of chunks) {
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

            results.forEach((contact) => {
              contactMap[contact.id] = contact;
            });
          } catch (error) {
            console.warn(
              `Error fetching contact details for chunk of ${chunk.length} contacts:`,
              error,
            );
          }
        }

        return contactMap;
      } catch (error) {
        console.warn("Error processing contact details:", error);
        return {};
      }
    },
    async processListMemberships(listId, listInfo) {
      const lastMembershipTimestamp = this._getLastMembershipTimestamp(listId);
      const newMemberships = [];

      let params = {
        limit: DEFAULT_LIMIT,
      };

      try {
        let hasMore = true;
        let latestMembershipTimestamp = lastMembershipTimestamp;

        if (!lastMembershipTimestamp) {
          const baselineTimestamp = new Date().toISOString();
          this._setLastMembershipTimestamp(listId, baselineTimestamp);
          return newMemberships;
        }

        while (hasMore) {
          const {
            results, paging,
          } =
            await this.hubspot.getListMembershipsByJoinOrder({
              listId,
              params,
            });

          if (!results) {
            console.warn(
              `No results returned from API for list ${listId} - possible API issue`,
            );
            break;
          }

          if (results.length === 0) {
            break;
          }

          for (const membership of results) {
            const { membershipTimestamp } = membership;

            if (membershipTimestamp > lastMembershipTimestamp) {
              newMemberships.push({
                membership,
                listInfo,
              });

              if (
                !latestMembershipTimestamp ||
                membershipTimestamp > latestMembershipTimestamp
              ) {
                latestMembershipTimestamp = membershipTimestamp;
              }
            }
          }

          if (paging?.next?.after) {
            params.after = paging.next.after;
          } else {
            hasMore = false;
          }
        }

        if (latestMembershipTimestamp !== lastMembershipTimestamp) {
          this._setLastMembershipTimestamp(listId, latestMembershipTimestamp);
        }
      } catch (error) {
        console.error(`Error processing list ${listId}:`, error);
      }

      return newMemberships;
    },
    async processResults() {
      if (!this.listId) {
        console.warn("No list selected to monitor");
        return;
      }

      const listId = this.listId?.value || this.listId;

      const listInfo = {
        listId,
        name: `List ${this.listId?.label || listId}`,
      };

      try {
        const newMemberships = await this.processListMemberships(
          listId,
          listInfo,
        );

        if (newMemberships.length > 0) {
          const contactIds = newMemberships.map(
            ({ membership }) => membership.recordId,
          );
          const contactDetails = await this.getContactDetails(contactIds);

          for (const {
            membership, listInfo,
          } of newMemberships) {
            const contactDetail = contactDetails[membership.recordId] || {};

            const eventData = {
              listId: listInfo.listId,
              listName: listInfo.name,
              contactId: membership.recordId,
              contact: contactDetail,
              membership,
              addedAt: membership.membershipTimestamp,
            };

            const meta = this.generateMeta(membership, listInfo);
            this.$emit(eventData, meta);
          }
        }
      } catch (error) {
        console.error(`Error processing list ${listId}:`, error);
      }
    },
    getParams() {
      return {};
    },
  },
  sampleEmit,
};
