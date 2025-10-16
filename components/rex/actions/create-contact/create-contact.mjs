import rex from "../../rex.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "rex-create-contact",
  name: "Create Contact",
  description: "Creates a new contact in Rex. [See the documentation](https://api-docs.rexsoftware.com/service/contacts#operation/create)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    rex,
    type: {
      type: "string",
      label: "Type",
      description: "Whether contact is person or company",
      options: constants.CONTACT_TYPE_OPTIONS,
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "Contact's first name",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Contact's last name",
    },
    email: {
      type: "string",
      label: "Email",
      description: "Contact's email address",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "Contact's phone number",
      optional: true,
    },
    address: {
      type: "string",
      label: "Address",
      description: "Contact's address",
      optional: true,
    },
    addressPostal: {
      type: "string",
      label: "Address Postal",
      description: "Contact's postal address",
      optional: true,
    },
    companyName: {
      type: "string",
      label: "Company Name",
      description: "Company name - company contact only",
      optional: true,
    },
    websiteUrl: {
      type: "string",
      label: "Website URL",
      description: "Company website URL - company contact only",
      optional: true,
    },
    isDnd: {
      type: "boolean",
      label: "Is DND?",
      description: "Whether contact can be contacted for marketing purposes",
      optional: true,
    },
    nameLegal: {
      type: "string",
      label: "Name Legal",
      description: "Contact's legal name",
      optional: true,
    },
    nameSalutation: {
      type: "string",
      label: "Name Salutation",
      description: "Contact's name as salutation",
      optional: true,
    },
    nameAddressee: {
      type: "string",
      label: "Name Address",
      description: "Contact's name as addressee",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      address: this.address,
      address_postal: this.addressPostal,
      company_name: this.companyName,
      website_url: this.websiteUrl,
      is_dnd: this.isDnd,
      type: this.type,
      name_legal: this.nameLegal,
      name_salutation: this.nameSalutation,
      name_addressee: this.nameAddressee,
      related: {
        contact_names: [
          {
            name_first: this.firstName,
            name_last: this.lastName,
          },
        ],
        contact_emails: this.email
          ? [
            {
              email_address: this.email,
            },
          ]
          : undefined,
        contact_phones: this.phone
          ? [
            {
              phone_number: this.phone,
            },
          ]
          : undefined,
      },
    };

    const { result } = await this.rex.createContact({
      data: {
        data,
      },
      $,
    });

    if (result?.id) {
      $.export("$summary", `Successfully created contact with ID ${result.id}.`);
    }

    return result;
  },
};
