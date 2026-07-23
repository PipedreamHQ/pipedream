// x-pd-ai: optimized
import common from "../common/base.mjs";

export default {
  ...common,
  key: "google_contacts-create-contact-group",
  name: "Create Contact Group",
  description: "Creates a new contact group for the authenticated user. [See the documentation](https://developers.google.com/people/api/rest/v1/contactGroups/create)",
  version: "0.0.1",
  annotations: {
    "destructiveHint": false,
    "openWorldHint": true,
    "readOnlyHint": false,
  },
  type: "action",
  props: {
    ...common.props,
    name: {
      type: "string",
      label: "Name",
      description: "The name of the contact group to create.",
    },
  },
  methods: {
    async processResults(client) {
      return this.googleContacts.createContactGroup(client, {
        requestBody: {
          contactGroup: {
            name: this.name,
          },
        },
      });
    },
    emitSummary($, group) {
      $.export("$summary", `Successfully created contact group ${group.name}`);
    },
  },
};
