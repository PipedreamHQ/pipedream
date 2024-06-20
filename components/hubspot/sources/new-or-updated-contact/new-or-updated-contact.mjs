import common from "../common/common.mjs";
import {
  DEFAULT_LIMIT, DEFAULT_CONTACT_PROPERTIES,
} from "../../common/constants.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "hubspot-new-or-updated-contact",
  name: "New or Updated Contact",
  description: "Emit new event for each new or updated contact in Hubspot.",
  version: "0.0.1",
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
      const {
        id,
        properties,
      } = contact;
      const ts = this.getTs(contact);
      return {
        id: this.newOnly
          ? id
          : `${id}-${ts}`,
        summary: `${properties.firstname} ${properties.lastname}`,
        ts,
      };
    },
    isRelevant(contact, updatedAfter) {
      return this.getTs(contact) > updatedAfter;
    },
    getParams() {
      const { properties = [] } = this;
      return {
        data: {
          limit: DEFAULT_LIMIT,
          sorts: [
            {
              propertyName: "lastmodifieddate",
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
    },
    async processResults(after, params) {
      await this.searchCRM(params, after);
    },
  },
  sampleEmit,
};
