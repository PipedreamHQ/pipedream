import app from "../../elastic_email.app.mjs";

export default {
  key: "elastic_email-update-contact",
  name: "Update Contact",
  description: "Update a contact in an Elastic Email account. [See the documentation](https://elasticemail.com/developers/api-documentation/rest-api#operation/contactsByEmailPut)",
  version: "0.0.{{ts}}",
  type: "action",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
  },
  async run() {
  },
};
