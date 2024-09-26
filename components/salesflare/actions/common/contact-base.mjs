import app from "../../salesflare.app.mjs";

export default {
  props: {
    app,
    email: {
      propDefinition: [
        app,
        "email",
      ],
    },
    prefix: {
      type: "string",
      label: "Prefix",
      description: "Contact prefix",
      optional: true,
    },
    firstname: {
      type: "string",
      label: "Firstname",
      description: "Firstname of the contact",
      optional: true,
    },
    middle: {
      type: "string",
      label: "Middlename",
      description: "Middlename of the contact",
      optional: true,
    },
    lastname: {
      type: "string",
      label: "Lastname",
      description: "Lastname of the contact",
      optional: true,
    },
    suffix: {
      type: "string",
      label: "Suffix",
      description: "Suffix of the contact",
      optional: true,
    },
    name: {
      propDefinition: [
        app,
        "name",
      ],
      description: "Name of the contact",
    },
    birthDate: {
      type: "string",
      label: "Birth Date",
      description: "Birth date of contact. Must be in ISO format. e.g. `1990-11-17T08:07:00Z`",
      optional: true,
    },
    tags: {
      propDefinition: [
        app,
        "tags",
      ],
    },
    city: {
      propDefinition: [
        app,
        "city",
      ],
    },
    country: {
      propDefinition: [
        app,
        "country",
      ],
    },
    stateRegion: {
      propDefinition: [
        app,
        "stateRegion",
      ],
    },
    street: {
      propDefinition: [
        app,
        "street",
      ],
    },
    zip: {
      propDefinition: [
        app,
        "zip",
      ],
    },
    phoneNumber: {
      propDefinition: [
        app,
        "phoneNumber",
      ],
    },
    socialProfiles: {
      propDefinition: [
        app,
        "socialProfiles",
      ],
    },
    faxNumber: {
      type: "string",
      label: "Fax Number",
      description: "Fax number of the contact",
      optional: true,
    },
    organisaton: {
      type: "string",
      label: "Organisation",
      description: "Organisation (position)",
      optional: true,
    },
    role: {
      type: "string",
      label: "Role",
      description: "Role (position)",
      optional: true,
    },
    custom: {
      propDefinition: [
        app,
        "custom",
      ],
    },
  },
};
