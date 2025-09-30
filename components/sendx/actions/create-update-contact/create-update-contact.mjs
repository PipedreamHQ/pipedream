import { parseObject } from "../../common/utils.mjs";
import sendx from "../../sendx.app.mjs";

export default {
  key: "sendx-create-update-contact",
  name: "Create or Update Contact",
  description: "Creates a new contact or updates an existing one with user-provided data. [See the documentation](https://github.com/sendx/sendx-api-nodejs/tree/master)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    sendx,
    email: {
      type: "string",
      label: "Email",
      description: "The email of the contact.",
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The first name of the contact.",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The last name of the contact.",
      optional: true,
    },
    newEmail: {
      type: "string",
      label: "New Email",
      description: "The new email of the contact if it needs to be updated.",
      optional: true,
    },
    company: {
      type: "string",
      label: "Company",
      description: "The company of the contact.",
      optional: true,
    },
    birthday: {
      type: "string",
      label: "Birthday",
      description: "The birthday of the contact in YYYY-MM-DD format.",
      optional: true,
    },
    customFields: {
      type: "object",
      label: "Custom Fields",
      description: "Custom fields for the contact.",
      optional: true,
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "Tags to associate with the contact.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.sendx.upsertContact({
      $,
      data: {
        email: this.email,
        firstName: this.firstName,
        lastName: this.lastName,
        newEmail: this.newEmail,
        company: this.company,
        birthday: this.birthday,
        customFields: parseObject(this.customFields),
        tags: parseObject(this.tags),
      },
    });
    console.log("response: ", response);

    $.export("$summary", `Successfully created or updated the contact with email: ${this.email}`);
    return response;
  },
};
