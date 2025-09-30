import app from "../../superphone.app.mjs";
import contact from "../../common/queries/contact.mjs";

export default {
  key: "superphone-create-new-contact",
  name: "Create New Contact",
  description: "Create a new contact. [See the documentation](https://api.superphone.io/docs/mutation.doc.html)",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    firstName: {
      propDefinition: [
        app,
        "firstName",
      ],
    },
    lastName: {
      propDefinition: [
        app,
        "lastName",
      ],
    },
    mobile: {
      propDefinition: [
        app,
        "mobile",
      ],
    },
    email: {
      optional: false,
      propDefinition: [
        app,
        "email",
      ],
    },
    birthday: {
      propDefinition: [
        app,
        "birthday",
      ],
    },
    twitter: {
      propDefinition: [
        app,
        "twitter",
      ],
    },
    instagram: {
      propDefinition: [
        app,
        "instagram",
      ],
    },
    linkedin: {
      propDefinition: [
        app,
        "linkedin",
      ],
    },
    jobTitle: {
      propDefinition: [
        app,
        "jobTitle",
      ],
    },
    country: {
      propDefinition: [
        app,
        "country",
      ],
    },
    province: {
      propDefinition: [
        app,
        "province",
      ],
    },
    city: {
      propDefinition: [
        app,
        "city",
      ],
    },
    zipCode: {
      propDefinition: [
        app,
        "zipCode",
      ],
    },
  },
  methods: {
    createContact(variables = {}) {
      return this.app.makeRequest({
        query: contact.mutations.createContact,
        variables,
      });
    },
  },
  async run({ $: step }) {
    const {
      // eslint-disable-next-line no-unused-vars
      app,
      createContact,
      ...input
    } = this;

    const {
      createContact: {
        contact,
        contactUserErrors,
      },
    } = await createContact({
      input,
    });

    if (contactUserErrors?.length) {
      throw new Error(JSON.stringify(contactUserErrors));
    }

    step.export("$summary", `Successfully created contact with ID ${contact.id}`);

    return contact;
  },
};
