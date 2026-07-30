// x-pd-ai: optimized
import common from "../common/base.mjs";

export default {
  ...common,
  key: "google_contacts-list-contact-groups",
  name: "List Contact Groups",
  description: "Lists the authenticated user's contact groups. [See the documentation](https://developers.google.com/people/api/rest/v1/contactGroups/list)",
  version: "0.0.1",
  annotations: {
    "destructiveHint": false,
    "openWorldHint": true,
    "readOnlyHint": true,
  },
  type: "action",
  props: {
    ...common.props,
  },
  methods: {
    async processResults(client) {
      const params = {};
      const groups = [];

      do {
        const {
          contactGroups = [],
          nextPageToken,
        } = await this.googleContacts.listContactGroups(client, params);

        groups.push(...contactGroups);
        params.pageToken = nextPageToken;
      } while (params.pageToken);

      return groups;
    },
    emitSummary($, groups) {
      $.export("$summary", `Successfully retrieved ${groups.length} contact groups`);
    },
  },
};
