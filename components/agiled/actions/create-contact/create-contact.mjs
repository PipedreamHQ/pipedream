import app from "../../agiled.app.mjs";

export default {
  key: "agiled-create-contact",
  name: "Create Contact",
  description: "Creates a new contact in Agiled. [See the documentation](https://my.agiled.app/developers)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    firstName: {
      type: "string",
      label: "First Name",
      description: "First name of the contact",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Last name of the contact",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email of the contact",
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "Phone number of the contact",
      optional: true,
    },
    jobTitle: {
      type: "string",
      label: "Job Title",
      description: "Job title of the contact",
      optional: true,
    },
    note: {
      type: "string",
      label: "Note",
      description: "Note of the contact",
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
  async run({ $ }) {
    const {
      createContact,
      firstName,
      lastName,
      email,
      phone,
      jobTitle,
      note,
    } = this;

    const response = await createContact({
      $,
      data: {
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        job_title: jobTitle,
        note,
      },
    });

    $.export("$summary", `Successfully created contact with ID \`${response.data.id}\``);
    return response;
  },
};
