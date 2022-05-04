import common from "../common/base.mjs";

export default {
  ...common,
  key: "google_contacts-get-contact",
  name: "Get Contact",
  description: "Get information about a contact. [See the docs here](https://developers.google.com/people/api/rest/v1/people/get)",
  version: "0.0.1",
  type: "action",
  props: {
    ...common.props,
    resourceName: {
      propDefinition: [
        common.props.googleContacts,
        "resourceName",
      ],
    },
    fields: {
      propDefinition: [
        common.props.googleContacts,
        "fields",
      ],
    },
  },
  methods: {
    async processResults(client) {
      return this.googleContacts.getContact(client, {
        resourceName: this.resourceName,
        personFields: this.fields.join(),
      });
    },
    emitSummary($) {
      $.export("$summary", "Successfully retrieved contact");
    },
  },
};
