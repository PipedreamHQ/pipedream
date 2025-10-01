import clientify from "../../clientify.app.mjs";

export default {
  key: "clientify-create-contact",
  name: "Create Contact",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Create a new contact. [See the documentation](https://developer.clientify.com/#8c678e88-4315-4470-a072-d6b659ace6e8)",
  type: "action",
  props: {
    clientify,
    firstName: {
      propDefinition: [
        clientify,
        "firstName",
      ],
    },
    lastName: {
      propDefinition: [
        clientify,
        "lastName",
      ],
      optional: true,
    },
    email: {
      propDefinition: [
        clientify,
        "email",
      ],
      optional: true,
    },
    phone: {
      propDefinition: [
        clientify,
        "phone",
      ],
      optional: true,
    },
    status: {
      propDefinition: [
        clientify,
        "status",
      ],
      optional: true,
    },
    title: {
      propDefinition: [
        clientify,
        "title",
      ],
      optional: true,
    },
    company: {
      propDefinition: [
        clientify,
        "company",
      ],
      optional: true,
    },
    contactType: {
      propDefinition: [
        clientify,
        "contactType",
      ],
      optional: true,
    },
    contactSource: {
      propDefinition: [
        clientify,
        "contactSource",
      ],
      optional: true,
    },
    addressType: {
      propDefinition: [
        clientify,
        "addressType",
      ],
      optional: true,
    },
    street: {
      propDefinition: [
        clientify,
        "street",
      ],
      optional: true,
    },
    city: {
      propDefinition: [
        clientify,
        "city",
      ],
      optional: true,
    },
    state: {
      propDefinition: [
        clientify,
        "state",
      ],
      optional: true,
    },
    country: {
      propDefinition: [
        clientify,
        "country",
      ],
      optional: true,
    },
    postalCode: {
      propDefinition: [
        clientify,
        "postalCode",
      ],
      optional: true,
    },
    customFields: {
      propDefinition: [
        clientify,
        "customFields",
      ],
      optional: true,
    },
    description: {
      propDefinition: [
        clientify,
        "description",
      ],
      optional: true,
    },
    remarks: {
      propDefinition: [
        clientify,
        "remarks",
      ],
      optional: true,
    },
    summary: {
      propDefinition: [
        clientify,
        "summary",
      ],
      optional: true,
    },
    message: {
      propDefinition: [
        clientify,
        "message",
      ],
      optional: true,
    },
    lastContact: {
      propDefinition: [
        clientify,
        "lastContact",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      firstName,
      lastName,
      contactType,
      contactSource,
      addressType,
      street,
      city,
      state,
      country,
      postalCode,
      customFields,
      lastContact,
      ...data
    } = this;

    const response = await this.clientify.createContact({
      $,
      data: {
        ...data,
        first_name: firstName,
        last_name: lastName,
        contact_type: contactType,
        contact_source: contactSource,
        address: [
          {
            street,
            city,
            state,
            country,
            postal_code: postalCode,
            type: addressType,
          },
        ],
        custom_fields: customFields && Object.keys(customFields).map((key) => ({
          field: key,
          value: customFields[key],
        })),
        last_contact: lastContact,
      },
    });

    $.export("$summary", `A new contact with Id: ${response.id} was successfully created!`);
    return response;
  },
};
