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
  version: "0.0.10",
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
      propDefinition: [
        common.props.hubspot,
        "listId",
      ],
      type: "string",
      description: "Select the list to watch for new contacts.",
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
    _getLastMembershipTimestamp(listId) {
      const key = `list_${listId}_last_timestamp`;
      return this.db.get(key);
    },
    _setLastMembershipTimestamp(listId, timestamp) {
      const key = `list_${listId}_last_timestamp`;
      this.db.set(key, timestamp);
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

      try {
        const { results } = await this.hubspot.batchGetObjects({
          objectType: "contacts",
          data: {
            inputs: contactIds.map((id) => ({
              id,
            })),
            properties: allProperties,
          },
        });

        const contactMap = {};
        results.forEach((contact) => {
          contactMap[contact.id] = contact;
        });
        return contactMap;
      } catch (error) {
        console.warn("Error fetching contact details:", error);
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

          if (!results || results.length === 0) {
            break;
          }

          for (const membership of results) {
            const { membershipTimestamp } = membership;

            if (
              new Date(membershipTimestamp) > new Date(lastMembershipTimestamp)
            ) {
              newMemberships.push({
                membership,
                listInfo,
              });

              if (
                !latestMembershipTimestamp ||
                new Date(membershipTimestamp) >
                  new Date(latestMembershipTimestamp)
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
      const { listId } = this;

      if (!listId) {
        console.warn("No list selected to monitor");
        return;
      }

      const listInfo = {
        listId,
        name: `List ${listId}`,
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
              addedAt: new Date().toISOString(),
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
