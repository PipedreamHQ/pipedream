import {
  DEFAULT_CONTACT_PROPERTIES,
  DEFAULT_LIMIT,
} from "../../common/constants.mjs";
import common from "../common/common.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "hubspot-new-or-updated-contact",
  name: "New or Updated Contact",
  description: "Emit new event for each new or updated contact in Hubspot.",
  version: "0.0.24",
  dedupe: "unique",
  type: "source",
  props: {
    ...common.props,
    info: {
      type: "alert",
      alertType: "info",
      content: `Properties:\n\`${DEFAULT_CONTACT_PROPERTIES.join(", ")}\``,
    },
    properties: {
      propDefinition: [
        common.props.hubspot,
        "contactProperties",
        () => ({
          excludeDefaultProperties: true,
        }),
      ],
      label: "Additional properties to retrieve",
    },
    lists: {
      propDefinition: [
        common.props.hubspot,
        "lists",
      ],
      withLabel: false,
      optional: true,
    },
    newOnly: {
      type: "boolean",
      label: "New Only",
      description: "Emit events only for new contacts",
      default: false,
      optional: true,
    },
  },
  methods: {
    ...common.methods,
    getTs(contact) {
      return this.newOnly
        ? Date.parse(contact.createdAt)
        : Date.parse(contact.updatedAt);
    },
    generateMeta(contact) {
      const { id } = contact;
      const ts = this.getTs(contact);
      return {
        id: this.newOnly
          ? id
          : `${id}-${ts}`,
        summary: `Record ID: ${id}`,
        ts,
      };
    },
    async translateListIds(lists) {
      const listIds = [];
      for (const list of lists) {
        const { listId } = await this.hubspot.translateLegacyListId({
          params: {
            legacyListId: list,
          },
        });
        listIds.push(listId);
      }
      return listIds;
    },
    async isRelevant(contact, updatedAfter) {
      if (this.getTs(contact) < updatedAfter) {
        return false;
      }
      if (this.lists?.length) {
        const { results } = await this.hubspot.getMemberships({
          objectType: "contacts",
          objectId: contact.id,
        });
        const contactListIds = results?.map(({ listId }) => listId) || [];
        const listIds = await this.translateListIds(this.lists);
        for (const list of listIds) {
          if (contactListIds.includes(list)) {
            return true;
          }
        }
        return false;
      }
      return true;
    },
    getParams(after) {
      const { properties = [] } = this;
      const dateProperty = this.newOnly
        ? "createdate"
        : "lastmodifieddate";

      const params = {
        data: {
          limit: DEFAULT_LIMIT,
          sorts: [
            {
              propertyName: dateProperty,
              direction: "DESCENDING",
            },
          ],
          properties: [
            ...DEFAULT_CONTACT_PROPERTIES,
            ...properties,
          ],
        },
        object: "contacts",
      };

      if (after) {
        params.data.filterGroups = [
          {
            filters: [
              {
                propertyName: dateProperty,
                operator: "GT",
                value: after,
              },
            ],
          },
        ];
      }

      return params;
    },
    async processResults(after, params) {
      await this.searchCRM(params, after);
    },
  },
  sampleEmit,
};
