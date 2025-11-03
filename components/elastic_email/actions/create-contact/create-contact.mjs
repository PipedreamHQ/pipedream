import app from "../../elastic_email.app.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "elastic_email-create-contact",
  name: "Create Contact",
  description: "Create a contact in an Elastic Email account. [See the documentation](https://elasticemail.com/developers/api-documentation/rest-api#operation/contactsPost)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    email: {
      type: "string",
      label: "Email",
      description: "The email of the contact",
    },
    status: {
      propDefinition: [
        app,
        "contactStatus",
      ],
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The first name of the contact",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The last name of the contact",
      optional: true,
    },
    customFields: {
      type: "object",
      label: "Custom Fields",
      description: "A key-value collection of custom contact fields which can be used in the system. Only already existing custom fields will be saved.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.createContact({
      $,
      data: [
        {
          Email: this.email,
          Status: this.status,
          FirstName: this.firstName,
          LastName: this.lastName,
          CustomFields: parseObject(this.customFields),
        },
      ],
    });
    $.export("$summary", "Contact created successfully");
    return response;
  },
};
