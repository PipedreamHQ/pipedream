import smashsend from "../../smashsend.app.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "smashsend-create-or-update-contact",
  name: "Create or Update Contact",
  description: "Create a new contact or update an existing contact. [See the documentation](https://smashsend.com/docs/api/contacts)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    smashsend,
    email: {
      type: "string",
      label: "Email",
      description: "The email address of the contact. If the contact already exists, this will update the contact.",
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
    phone: {
      type: "string",
      label: "Phone",
      description: "The phone number of the contact",
      optional: true,
    },
    avatarUrl: {
      type: "string",
      label: "Avatar URL",
      description: "The URL of the contact's avatar",
      optional: true,
    },
    countryCode: {
      type: "string",
      label: "Country Code",
      description: "Two-letter ISO country code like `US`",
      optional: true,
    },
    properties: {
      type: "object",
      label: "Properties",
      description: "Additional properties of the contact. Properties must exist in your workspace.",
      optional: true,
    },
  },
  async run({ $ }) {
    const { contact } = await this.smashsend.createContact({
      $,
      data: {
        properties: {
          email: this.email,
          firstName: this.firstName,
          lastName: this.lastName,
          phone: this.phone,
          avatarUrl: this.avatarUrl,
          countryCode: this.countryCode,
          ...parseObject(this.properties),
        },
      },
    });
    if (contact?.id) {
      $.export("$summary", `Successfully ${contact.updatedAt
        ? "updated"
        : "created"} contact ${contact.id}`);
    }
    return contact;
  },
};
