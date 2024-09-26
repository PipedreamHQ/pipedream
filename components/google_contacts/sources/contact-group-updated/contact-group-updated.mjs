import common from "../common/common.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  key: "google_contacts-contact-group-updated",
  name: "Contact Group Updated",
  description: "Emit new event when a contact group is updated. [See the documentation](https://developers.google.com/people/api/rest/v1/contactGroups/list)",
  version: "0.0.2",
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
      const ts = this.getTs(group);
      return {
        id: `${group.resourceName}${ts}`,
        summary: group.formattedName,
        ts,
      };
    },
  },
};
