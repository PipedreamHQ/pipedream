import app from "../../elasticemail.app.mjs";

export default {
  key: "elastic_email-create-contact",
  name: "Create Contact",
  description: "Create a contact in an Elastic Email account. [See the documentation](https://elasticemail.com/developers/api-documentation/rest-api#operation/contactsPost)",
  version: "0.0.{{ts}}",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
  },
  async run() {
  },
};
