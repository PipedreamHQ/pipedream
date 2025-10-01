import app from "../../project_broadcast.app.mjs";
export default {
  key: "project_broadcast-create-contact",
  name: "Create Contact",
  description: "Create a new contact. [See the documentation](https://www.projectbroadcast.com/apidoc/#api-Contacts-CreateContact)",
  type: "action",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    phoneNumber: {
      type: "string",
      label: "Phone Number",
      description: "The phone number of the contact.",
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email of the contact.",
      optional: true,
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The first name of the contact.",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The last name of the contact.",
      optional: true,
    },
    company: {
      type: "string",
      label: "Company Name",
      description: "The company name of the contact.",
      optional: true,
    },
    birthday: {
      type: "string",
      label: "Birthday",
      description: "The birthday of the contact. The format should be `MM-DD`.",
      optional: true,
    },
    anniversary: {
      type: "string",
      label: "Anniversary",
      description: "The anniversary of the contact. The format should be `MM-DD`.",
      optional: true,
    },
    notes: {
      type: "string",
      label: "Notes",
      description: "Notes for the contact.",
      optional: true,
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "Tags for the contact.",
      optional: true,
    },
  },
  methods: {
    createContact(args = {}) {
      return this.app.post({
        path: "/contacts",
        ...args,
      });
    },
  },
  run({ $: step }) {
    const {
      // eslint-disable-next-line no-unused-vars
      app,
      createContact,
      ...data
    } = this;

    return createContact({
      step,
      data,
      summary: (response) => `Successfully created contact with ID \`${response._id}.\``,
    });
  },
};
