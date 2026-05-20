import { ConfigurationError } from "@pipedream/platform";
import common from "../common/base.mjs";
import props from "../common/props.mjs";

export default {
  ...common,
  key: "google_contacts-create-contact",
  name: "Create Contact",
  description: "Creates a contact. Provide at least one of the optional fields (name, email, phone, etc.). [See the documentation](https://developers.google.com/people/api/rest/v1/people/createContact)",
  version: "0.1.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...common.props,
    ...props,
  },
  methods: {
    ...common.methods,
    async processResults(client) {
      const requestBody = this.getRequestBody(this);
      if (!Object.keys(requestBody).length) {
        throw new ConfigurationError("At least one contact field (name, email, phone, etc.) is required.");
      }
      return this.googleContacts.createContact(client, {
        requestBody,
        personFields: this.getPersonFields(requestBody),
      });
    },
    emitSummary($, results) {
      $.export("$summary", `Successfully created contact with ID ${results.resourceName.split("/").pop()}`);
    },
  },
};
