import constants from "../../common/constants.mjs";
import app from "../../quaderno.app.mjs";

export default {
  key: "quaderno-create-contact",
  name: "Create Contact",
  description: "Add a new contact to Quaderno. [See the Documentation](https://developers.quaderno.io/api/#tag/Contacts/operation/createContact).",
  type: "action",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    kind: {
      type: "string",
      label: "Kind",
      description: "The type of contact. Can be `person` or `company`",
      options: Object.values(constants.CONTACT_TYPE),
      default: constants.CONTACT_TYPE.PERSON,
      reloadProps: true,
    },
    country: {
      propDefinition: [
        app,
        "country",
      ],
    },
    city: {
      propDefinition: [
        app,
        "city",
      ],
    },
    region: {
      propDefinition: [
        app,
        "region",
      ],
    },
    streetLine1: {
      propDefinition: [
        app,
        "streetLine1",
      ],
    },
    email: {
      propDefinition: [
        app,
        "email",
      ],
    },
    phone1: {
      propDefinition: [
        app,
        "phone1",
      ],
    },
    postalCode: {
      propDefinition: [
        app,
        "postalCode",
      ],
    },
    fullName: {
      propDefinition: [
        app,
        "fullName",
      ],
    },
  },
  async additionalProps() {
    if (this.kind === constants.CONTACT_TYPE.PERSON) {
      return {
        firstName: {
          type: "string",
          label: "First Name",
          description: "The contact's first name.",
        },
        lastName: {
          type: "string",
          label: "Last Name",
          description: "The contact's last name.",
          optional: true,
        },
      };
    }
    return {
      firstName: {
        type: "string",
        label: "Business Name",
        description: "The contact's business name.",
      },
      department: {
        type: "string",
        label: "Department",
        description: "If the contact is a `company`, this is the deparment.",
        optional: true,
      },
      contactPerson: {
        type: "string",
        label: "Contact Person",
        description: "If the contact is a `company`, this is its contact person.",
        optional: true,
      },
    };
  },
  methods: {
    createContact(args = {}) {
      return this.app.post({
        path: "/contacts",
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const {
      kind, country, city, region, streetLine1, contactPerson,
      department, email, phone1, postalCode, fullName, firstName,
      lastName,
    } = this;

    const response = await this.createContact({
      step,
      data: {
        kind,
        country,
        city,
        region,
        street_line_1: streetLine1,
        contact_person: contactPerson,
        department,
        email,
        phone_1: phone1,
        postal_code: postalCode,
        full_name: fullName,
        first_name: firstName,
        last_name: lastName,
      },
    });

    step.export("$summary", `Successfully created contact with ID ${response.id}`);

    return response;
  },
};
