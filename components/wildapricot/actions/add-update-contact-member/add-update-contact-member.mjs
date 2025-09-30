import wildapricot from "../../wildapricot.app.mjs";

export default {
  key: "wildapricot-add-update-contact-member",
  name: "Add or Update Contact or Member",
  description: "Adds or updates a contact or member details in the user's WildApricot database. [See the documentation](https://app.swaggerhub.com/apis-docs/WildApricot/wild-apricot_public_api/7.24.0#/Contacts/CreateContact)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    wildapricot,
    accountId: {
      propDefinition: [
        wildapricot,
        "accountId",
      ],
      reloadProps: true,
    },
    contactId: {
      propDefinition: [
        wildapricot,
        "contactId",
        (c) => ({
          accountId: c.accountId,
        }),
      ],
      optional: true,
    },
  },
  async additionalProps() {
    const props = {};
    const fields = await this.wildapricot.listContactFields({
      accountId: this.accountId,
    });
    for (const field of fields) {
      if (field.IsEditable && field.Access === "Public") {
        props[field.Id] = {
          type: "string",
          label: field.FieldName,
          optional: true,
        };
      }
    }
    return props;
  },
  async run({ $ }) {
    const fields = await this.wildapricot.listContactFields({
      $,
      accountId: this.accountId,
    });
    const fieldValues = [];
    for (const field of fields) {
      if (this[field.Id]) {
        fieldValues.push({
          FieldName: field.FieldName,
          Value: this[field.Id],
        });
      }
    }
    const args = {
      $,
      accountId: this.accountId,
      data: {
        FieldValues: fieldValues,
      },
    };
    if (this.contactId) {
      args.data.Id = this.contactId;
    }
    const response = this.contactId
      ? await this.wildapricot.updateContact({
        contactId: this.contactId,
        ...args,
      })
      : await this.wildapricot.createContact(args);
    $.export("$summary", `Successfully ${this.contactId
      ? "updated"
      : "created"} contact/member with ID ${response.Id}`);
    return response;
  },
};
