// x-pd-ai: optimized
import common from "../common/base.mjs";

export default {
  ...common,
  key: "google_contacts-update-contact-group",
  name: "Update Contact Group",
  description:
    "Updates the name of an existing contact group. [See the documentation](https://developers.google.com/people/api/rest/v1/contactGroups/update)",
  version: "0.0.2",
  annotations: {
    "destructiveHint": false,
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
    name: {
      type: "string",
      label: "Name",
      description: "The new name for the contact group.",
    },
  },
  methods: {
    async processResults(client) {
      // contactGroups.update requires the group's current etag for optimistic
      // concurrency, so fetch it first (mirrors how update-contact works).
      const { etag } = await this.googleContacts.getContactGroup(client, {
        resourceName: this.resourceName,
      });
      return this.googleContacts.updateContactGroup(client, {
        resourceName: this.resourceName,
        requestBody: {
          contactGroup: {
            etag,
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
