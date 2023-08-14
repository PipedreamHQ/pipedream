import common from "../common/common.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  key: "google_contacts-contact-group-created",
  name: "New Contact Group Created",
  description: "Emit new event when a new contact group is created. [See the documentation](https://developers.google.com/people/api/rest/v1/contactGroups/list)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async getEvents({
      client, params = {}, pageSize = constants.DEFAULT_PAGE_SIZE,
    }) {
      const {
        contactGroups, nextPageToken,
      } = await this.googleContacts.listContactGroups(client, {
        pageSize,
        ...params,
      });
      return {
        events: contactGroups.filter((group) => group?.metadata),
        nextPageToken,
      };
    },
    getParams() {
      return {
        groupFields: constants.GROUP_FIELDS.join(),
      };
    },
    getTs(group) {
      return Date.parse(group.metadata.updateTime);
    },
    generateMeta(group) {
      return {
        id: group.resourceName,
        summary: group.formattedName,
        ts: this.getTs(group),
      };
    },
  },
};
