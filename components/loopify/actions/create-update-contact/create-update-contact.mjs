import app from "../../loopify.app.mjs";

export default {
  key: "loopify-create-update-contact",
  name: "Create Or Update Contact",
  description: "Creates or updates a contact in Loopify. If the contact exists, it will be updated; otherwise, a new contact will be created. [See the documentation](https://api.loopify.com/docs/index.html#tag/Contacts)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    email: {
      type: "string",
      label: "Email",
      description: "The email address of the contact",
    },
    externalId: {
      type: "string",
      label: "External ID",
      description: "The external ID of the contact",
      optional: true,
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The first name of the contact",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The last name of the contact",
      optional: true,
    },
    mobile: {
      type: "string",
      label: "Mobile",
      description: "The mobile number of the contact",
      optional: true,
    },
    title: {
      type: "string",
      label: "Title",
      description: "The title of the contact",
      optional: true,
    },
    companyName: {
      type: "string",
      label: "Company Name",
      description: "The company name of the contact",
      optional: true,
    },
    address: {
      type: "string",
      label: "Address",
      description: "The address of the contact",
      optional: true,
    },
    zip: {
      type: "string",
      label: "Zip",
      description: "The zip code of the contact",
      optional: true,
    },
    city: {
      type: "string",
      label: "City",
      description: "The city of the contact",
      optional: true,
    },
    country: {
      type: "string",
      label: "Country",
      description: "The country of the contact",
      optional: true,
    },
    state: {
      type: "string",
      label: "State",
      description: "The state of the contact",
      optional: true,
    },
    leadScore: {
      type: "integer",
      label: "Lead Score",
      description: "The lead score of the contact",
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
    updateContact({
      contactId, ...args
    } = {}) {
      return this.app.put({
        path: `/contacts/${contactId}`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      app,
      createContact,
      updateContact,
      email,
      ...props
    } = this;

    const { contacts } = await app.getContacts({
      $,
      params: {
        search: email,
      },
    });

    const [
      contact,
    ] = contacts;

    if (contact) {
      const response = await updateContact({
        $,
        contactId: contact._id,
        data: {
          email,
          ...props,
        },
      });

      $.export("$summary", `Successfully updated contact with ID \`${contact._id}\``);
      return response;
    }

    const response = await createContact({
      $,
      data: {
        email,
        ...props,
      },
    });

    $.export("$summary", `Successfully created contact with ID \`${response._id}\``);
    return response;
  },
};
