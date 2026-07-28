// x-pd-ai: optimized
import common from "../common/base.mjs";

export default {
  ...common,
  key: "google_contacts-delete-contact-group",
  name: "Delete Contact Group",
  description:
    "Deletes an existing contact group. [See the documentation](https://developers.google.com/people/api/rest/v1/contactGroups/delete)",
  version: "0.0.1",
  annotations: {
    "destructiveHint": true,
    "openWorldHint": true,
    "readOnlyHint": false,
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
    deleteContacts: {
      type: "boolean",
      label: "Delete Contacts",
      description:
        "Whether to also delete the contacts that belong to the group.",
      default: false,
    },
  },
  methods: {
    async processResults(client) {
      await this.googleContacts.deleteContactGroup(client, {
        resourceName: this.resourceName,
        deleteContacts: this.deleteContacts,
      });

      return {
        success: true,
        resourceName: this.resourceName,
      };
    },
    emitSummary($) {
      $.export(
        "$summary",
        `Successfully deleted contact group ${this.resourceName}`,
      );
    },
  },
};
