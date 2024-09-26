import common from "../common/common.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  key: "google_contacts-contact-created",
  name: "New Contact Created",
  description: "Emit new event when a new contact is created. [See the documentation](https://developers.google.com/people/api/rest/v1/people.connections/list)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async getEvents({
      client, params = {}, pageSize = constants.DEFAULT_PAGE_SIZE,
    }) {
      const {
        connections, nextPageToken,
      } = await this.googleContacts.listContacts(client, {
        pageSize,
        ...params,
      });
      return {
        events: connections,
        nextPageToken,
      };
    },
    getParams() {
      return {
        resourceName: constants.RESOURCE_NAME,
        personFields: constants.FIELD_OPTIONS.join(),
        sortOrder: "LAST_MODIFIED_DESCENDING",
      };
    },
    getTs(contact) {
      return Date.parse(contact.metadata.sources[0].updateTime);
    },
    generateMeta(contact) {
      return {
        id: contact.resourceName,
        summary: contact.names[0].displayName,
        ts: this.getTs(contact),
      };
    },
  },
};
