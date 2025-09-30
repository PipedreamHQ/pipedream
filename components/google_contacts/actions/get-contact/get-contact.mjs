import common from "../common/base.mjs";

export default {
  ...common,
  key: "google_contacts-get-contact",
  name: "Get Contact",
  description: "Get information about a contact. [See the documentation](https://developers.google.com/people/api/rest/v1/people/get)",
  version: "0.0.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
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
      $.export("$summary", `Successfully retrieved contact with ID ${this.resourceName.split("/").pop()}`);
    },
  },
};
