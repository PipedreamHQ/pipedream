import common from "../common/base.mjs";

export default {
  ...common,
  key: "google_contacts-create-contact",
  name: "Create Contact",
  description: "Creates a contact. [See the documentation](https://developers.google.com/people/api/rest/v1/people/createContact)",
  version: "0.1.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...common.props,
    personFields: {
      propDefinition: [
        common.props.googleContacts,
        "updatePersonFields",
      ],
      label: "Contact Fields",
      description: "Contact sections to include",
      reloadProps: true,
    },
  },
  async additionalProps() {
    return this.getPersonFieldProps(this.personFields);
  },
  methods: {
    ...common.methods,
    async processResults(client) {
      const requestBody = this.getRequestBody(this.personFields, this);

      return this.googleContacts.createContact(client, {
        requestBody,
        personFields: this.getPersonFields(this.personFields),
      });
    },
    emitSummary($, results) {
      $.export("$summary", `Successfully created contact with ID ${results.resourceName.split("/").pop()}`);
    },
  },
};
