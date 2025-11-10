import app from "../../elastic_email.app.mjs";

export default {
  key: "elastic_email-list-contacts",
  name: "List Contacts",
  description: "List contacts in an Elastic Email account. [See the documentation](https://elasticemail.com/developers/api-documentation/rest-api#operation/contactsGet)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    limit: {
      type: "integer",
      label: "Limit",
      description: "The maximum number of contacts to return",
      default: 100,
      optional: true,
    },
    offset: {
      type: "integer",
      label: "Offset",
      description: "The offset to start from",
      default: 0,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.listContacts({
      $,
      params: {
        limit: this.limit,
        offset: this.offset,
      },
    });
    $.export("$summary", `Successfully listed ${response?.length} contacts.`);
    return response;
  },
};
