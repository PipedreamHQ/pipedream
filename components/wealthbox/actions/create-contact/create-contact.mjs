import wealthbox from "../../wealthbox.app.mjs";
import { CONTACT_TYPES } from "../../common/constants.mjs";

const PERSON_TYPE = "Person";

export default {
  key: "wealthbox-create-contact",
  name: "Create Contact",
  description: "Create a new contact in Wealthbox. For `Person` type, provide First Name (and optionally Last Name). For `Household`, `Organization`, or `Trust` types, the Name field is used as the entity name (the API accepts a top-level `name` field for non-Person types). Example: create a `Person` contact with first name `Jane`, last name `Smith`, email `jane@acme.com`; returns the contact object including `id`, `first_name`, `last_name`, `email_addresses`, `type`, and `contact_type`. [See the documentation](http://dev.wealthbox.com/#contacts-create-a-new-contact-post)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    wealthbox,
    firstName: {
      type: "string",
      label: "First Name / Name",
      description: "For `Person` type: the contact’s first name. For `Household`, `Organization`, or `Trust` types: the full entity name (e.g. `Smith Family Household`). This field maps to `first_name` for Person records and `name` for all other types.",
    },
    recordType: {
      type: "string",
      label: "Type",
      description: "Record type. One of `Person`, `Household`, `Organization`, or `Trust`. Defaults to `Person` when omitted.",
      options: CONTACT_TYPES,
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The last name of the contact. Only applicable for `Person` type.",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "The primary email address of the contact. Sent to the Wealthbox API as the first entry in `email_addresses`. Example: `jane@acme.com`.",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "The phone number of the contact",
      optional: true,
    },
    company: {
      type: "string",
      label: "Company",
      description: "The name of the contact’s present company",
      optional: true,
    },
    contactType: {
      propDefinition: [
        wealthbox,
        "contactType",
      ],
      label: "Contact Type",
      description: "The user-defined contact type category (e.g. `Client`, `Prospect`). Distinct from the record Type field above.",
      optional: true,
    },
  },
  async run({ $ }) {
    const isPerson = !this.recordType || this.recordType === PERSON_TYPE;
    const nameFields = isPerson
      ? {
        first_name: this.firstName,
        last_name: this.lastName,
      }
      : {
        name: this.firstName,
      };

    const response = await this.wealthbox.createContact({
      data: {
        ...nameFields,
        type: this.recordType,
        email_addresses: this.email
          ? [
            {
              address: this.email,
            },
          ]
          : undefined,
        phone_numbers: this.phone
          ? [
            {
              address: this.phone,
            },
          ]
          : undefined,
        company: this.company,
        contact_type: this.contactType,
      },
      $,
    });

    if (response) {
      $.export("$summary", `Successfully created contact with ID ${response.id}`);
    }

    return response;
  },
};
