import common from "../common/base.mjs";

export default {
  ...common,
  key: "google_contacts-update-contact",
  name: "Update Contact",
  description: "Updates a contact. [See the docs here](https://developers.google.com/people/api/rest/v1/people/updateContact)",
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
    updatePersonFields: {
      propDefinition: [
        common.props.googleContacts,
        "updatePersonFields",
      ],
      reloadProps: true,
    },
  },
  async additionalProps() {
    return this.getPersonFieldProps(this.updatePersonFields);
  },
  methods: {
    ...common.methods,
    async processResults(client) {
      const {
        updatePersonFields,
        resourceName,
      } = this;

      const requestBody = this.getRequestBody(updatePersonFields, this);

      const { etag } = await this.googleContacts.getContact(client, {
        resourceName,
        personFields: "names",
      });

      requestBody.etag = etag;

      return this.googleContacts.updateContact(client, {
        resourceName,
        requestBody,
        updatePersonFields: updatePersonFields.join(),
      });
    },
    emitSummary($) {
      $.export("$summary", `Successfully updated contact with ID ${this.resourceName.split("/").pop()}`);
    },
  },
};
