import wix from "../../wix_api_key.app.mjs";

export default {
  key: "wix_api_key-create-contact",
  name: "Create Contact",
  description: "Creates a new contact. [See the documentation](https://dev.wix.com/api/rest/contacts/contacts/contacts-v4/create-contact)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    wix,
    site: {
      propDefinition: [
        wix,
        "site",
      ],
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email address of the new contact",
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "First name of the new contact",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Last name of the new contact",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "Phone number of the new contact",
    },
    labels: {
      propDefinition: [
        wix,
        "labels",
        (c) => ({
          siteId: c.site,
        }),
      ],
      default: [],
      optional: true,
    },
  },
  async run({ $ }) {
    const labels = Array.isArray(this.labels)
      ? this.labels
      : JSON.parse(this.labels);
    const response = await this.wix.createContact({
      siteId: this.site,
      data: {
        info: {
          name: {
            first: this.firstName,
            last: this.lastName,
          },
          emails: {
            items: [
              {
                email: this.email,
              },
            ],
          },
          phones: {
            items: [
              {
                phone: this.phone,
              },
            ],
          },
          labelKeys: {
            items: labels,
          },
        },
      },
      $,
    });

    if (response) {
      $.export("$summary", `Successfully created contact with ID ${response.contact.id}`);
    }

    return response;
  },
};
