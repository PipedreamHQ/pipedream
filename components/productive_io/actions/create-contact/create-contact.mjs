import constants from "../../common/constants.mjs";
import app from "../../productive_io.app.mjs";

export default {
  key: "productive_io-create-contact",
  name: "Create Contact",
  description: "Creates a new contact entry in Productive.io. [See the documentation](https://developer.productive.io/contact_entries.html#contact-entries-contact-entries-post)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    companyId: {
      propDefinition: [
        app,
        "companyId",
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the contact entry.",
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email of the contact entry.",
    },
    address: {
      type: "string",
      label: "Address",
      description: "The address of the contact entry.",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "The phone of the contact entry.",
      optional: true,
    },
    website: {
      type: "string",
      label: "Website",
      description: "The website of the contact entry.",
      optional: true,
    },
  },
  methods: {
    createContact(args = {}) {
      return this.app.post({
        path: "/contact_entries",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      createContact,
      companyId,
      name,
      email,
      address,
      phone,
      website,
    } = this;

    const response = await createContact({
      $,
      data: {
        data: {
          type: "contact_entries",
          attributes: {
            contactable_type: constants.CONTACTABLE_TYPE_OPTION.COMPANY.value,
            type: constants.CONTACT_TYPE_OPTION.EMAIL.value,
            name,
            email,
            address,
            phone,
            website,
          },
          relationships: {
            company: {
              data: {
                type: constants.CONTACTABLE_TYPE.company,
                id: companyId,
              },
            },
          },
        },
      },
    });

    $.export("$summary", `Successfully created contact with name: ${response.data?.attributes?.name}`);
    return response;
  },
};
