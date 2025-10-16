import app from "../../superphone.app.mjs";
import contact from "../../common/queries/contact.mjs";

export default {
  key: "superphone-update-contact",
  name: "Update Contact",
  description: "Update an existing contact. [See the documentation](https://api.superphone.io/docs/mutation.doc.html)",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    contactId: {
      propDefinition: [
        app,
        "contactId",
      ],
    },
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
    updateContact(variables = {}) {
      return this.app.makeRequest({
        query: contact.mutations.updateContact,
        variables,
      });
    },
  },
  async run({ $: step }) {
    const {
      // eslint-disable-next-line no-unused-vars
      app,
      updateContact,
      ...input
    } = this;

    const {
      updateContact: {
        contact,
        contactUserErrors,
      },
    } = await updateContact({
      input,
    });

    if (contactUserErrors?.length) {
      throw new Error(JSON.stringify(contactUserErrors));
    }

    step.export("$summary", `Successfully updated contact with ID ${contact.id}`);

    return contact;
  },
};
