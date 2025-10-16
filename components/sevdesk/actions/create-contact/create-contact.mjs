import { CONTACT_CATEGORIES } from "../../common/constants.mjs";
import sevdesk from "../../sevdesk.app.mjs";

export default {
  key: "sevdesk-create-contact",
  name: "Create Contact",
  description: "Create a new contact. [See the documentation](https://api.sevdesk.de/#tag/Contact/operation/createContact)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    sevdesk,
    category: {
      type: "integer",
      label: "Category",
      description: "Category of the contact",
      options: CONTACT_CATEGORIES,
    },
    parent: {
      propDefinition: [
        sevdesk,
        "contactId",
      ],
      label: "Parent Contact ID",
      description: "The parent contact to which this contact belongs. Must be an organization",
      optional: true,
    },
    surename: {
      type: "string",
      label: "First Name",
      description: "The first name of the contact, if it is not an organization.",
      optional: true,
    },
    familyname: {
      type: "string",
      label: "Last Name",
      description: "The last name of the contact, if it is not an organization.",
      optional: true,
    },
    name: {
      type: "string",
      label: "Name (Organization)",
      description: "The name of the contact, if it is an organization.",
      optional: true,
    },
    additionalOptions: {
      type: "object",
      label: "Additional Options",
      description: "Additional parameters to set for the contact. [See the documentation](https://api.sevdesk.de/#tag/Contact/operation/createContact) for all available parameters. Example: `{ \"description\": \"Contact description\" }`",
      optional: true,
    },
  },
  methods: {
    createContact(opts = {}) {
      return this.sevdesk._makeRequest({
        method: "POST",
        path: "/Contact",
        ...opts,
      });
    },
  },
  async run({ $ }) {
    const { objects: response } = await this.createContact({
      $,
      data: {
        category: {
          id: this.category,
          objectName: "Category",
        },
        parent: this.parent && {
          id: this.parent,
          objectName: "Contact",
        },
        surename: this.surename,
        familyname: this.familyname,
        name: this.name,
        ...this.additionalOptions,
      },
    });

    $.export("$summary", `Successfully created contact (ID: ${response.id})`);
    return response;
  },
};
