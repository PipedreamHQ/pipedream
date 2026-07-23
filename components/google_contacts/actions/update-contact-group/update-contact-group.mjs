import common from "../common/base.mjs";

export default {
  ...common,
  key: "google_contacts-update-contact-group",
  name: "Update Contact Group",
  description:
    "Updates the name of an existing contact group. [See the documentation](https://developers.google.com/people/api/rest/v1/contactGroups/update)",
  version: "0.0.1",
  annotations: {
    "destructiveHint": false,
    "openWorldHint": true,
    "readOnlyHint": false,
    "x-pd-ai": 1,
  },
  type: "action",
  props: {
    ...common.props,
    resourceName: {
      propDefinition: [
        common.props.googleContacts,
        "contactGroupResourceName",
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "The new name for the contact group.",
    },
  },
  methods: {
    async processResults(client) {
      return this.googleContacts.updateContactGroup(client, {
        resourceName: this.resourceName,
        requestBody: {
          contactGroup: {
            name: this.name,
          },
          updateGroupFields: "name",
        },
      });
    },
    emitSummary($) {
      $.export(
        "$summary",
        `Successfully updated contact group ${this.resourceName}`,
      );
    },
  },
};
