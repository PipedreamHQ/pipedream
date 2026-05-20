import { ConfigurationError } from "@pipedream/platform";
import common from "../common/base.mjs";
import props from "../common/props.mjs";

export default {
  ...common,
  key: "google_contacts-update-contact",
  name: "Update Contact",
  description: "Updates a contact. Provide at least one of the optional fields (name, email, phone, etc.) to update. [See the documentation](https://developers.google.com/people/api/rest/v1/people/updateContact)",
  version: "0.1.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
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
    ...props,
  },
  methods: {
    ...common.methods,
    async processResults(client) {
      const { resourceName } = this;
      const requestBody = this.getRequestBody(this);
      if (!Object.keys(requestBody).length) {
        throw new ConfigurationError("At least one contact field (name, email, phone, etc.) is required.");
      }
      const { etag } = await this.googleContacts.getContact(client, {
        resourceName,
        personFields: "names",
      });
      requestBody.etag = etag;
      return this.googleContacts.updateContact(client, {
        resourceName,
        requestBody,
        updatePersonFields: this.getPersonFields(requestBody),
      });
    },
    emitSummary($) {
      $.export("$summary", `Successfully updated contact with ID ${this.resourceName.split("/").pop()}`);
    },
  },
};
