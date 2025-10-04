import app from "../../missive.app.mjs";

export default {
  key: "missive-create-contact",
  name: "Create Contact",
  description: "Create a new contact. [See the Documentation](https://missiveapp.com/help/api-documentation/rest-endpoints#create-contact)",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    contactBookId: {
      propDefinition: [
        app,
        "contactBookId",
      ],
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
    notes: {
      type: "string",
      label: "Notes",
      description: "Notes about the contact.",
      optional: true,
    },
    starred: {
      type: "boolean",
      label: "Starred",
      description: "Whether the contact is starred.",
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
  async run({ $: step }) {
    const {
      contactBookId,
      firstName,
      lastName,
      notes,
      starred,
    } = this;

    const response = await this.createContact({
      step,
      data: {
        contacts: [
          {
            contact_book: contactBookId,
            first_name: firstName,
            last_name: lastName,
            notes,
            starred,
          },
        ],
      },
    });

    step.export("$summary", `Successfully created contact with ID ${response.contacts[0].id}.`);

    return response;
  },
};
