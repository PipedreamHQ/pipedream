import common from "../common/base.mjs";

export default {
  ...common,
  key: "google_contacts-delete-contact",
  name: "Delete Contact",
  description: "Deletes a contact. [See the docs here](https://developers.google.com/people/api/rest/v1/people/deleteContact)",
  version: "0.0.2",
  type: "action",
  props: {
    ...common.props,
    resourceName: {
      propDefinition: [
        common.props.googleContacts,
        "resourceName",
      ],
    },
  },
  methods: {
    async processResults(client) {
      return this.googleContacts.deleteContact(client, {
        resourceName: this.resourceName,
      });
    },
    emitSummary($) {
      $.export("$summary", `Successfully deleted contact with ID ${this.resourceName.split("/").pop()}`);
    },
  },
};
