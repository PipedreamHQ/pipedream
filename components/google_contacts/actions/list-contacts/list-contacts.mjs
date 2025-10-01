import common from "../common/base.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  key: "google_contacts-list-contacts",
  name: "List Contacts",
  description: "Lists all contacts of the authenticated user. [See the documentation](https://developers.google.com/people/api/rest/v1/people.connections/list)",
  version: "0.0.6",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    ...common.props,
    fields: {
      propDefinition: [
        common.props.googleContacts,
        "fields",
      ],
    },
  },
  methods: {
    async processResults(client) {
      const params = {
        resourceName: constants.RESOURCE_NAME,
        personFields: this.fields.join(),
      };
      const contacts = [];
      do {
        const {
          connections = [],
          nextPageToken,
        } = await this.googleContacts.listContacts(client, params);
        params.pageToken = nextPageToken;
        contacts.push(...connections);
      } while (params.pageToken);
      return contacts;
    },
    emitSummary($, contacts) {
      $.export("$summary", `Successfully retrieved ${contacts.length} contacts`);
    },
  },
};
