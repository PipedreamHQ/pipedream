import app from "../../salesflare.app.mjs";

export default {
  props: {
    app,
    name: {
      propDefinition: [
        app,
        "name",
      ],
      description: "Account name",
    },
    domain: {
      propDefinition: [
        app,
        "domain",
      ],
      description: "Account's website",
    },
    website: {
      propDefinition: [
        app,
        "website",
      ],
      description: "Account's website",
    },
    description: {
      propDefinition: [
        app,
        "description",
      ],
      description: "Description of the account",
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
    email: {
      propDefinition: [
        app,
        "email",
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
    tags: {
      propDefinition: [
        app,
        "tags",
      ],
    },
    links: {
      propDefinition: [
        app,
        "links",
      ],
    },
  },
};
