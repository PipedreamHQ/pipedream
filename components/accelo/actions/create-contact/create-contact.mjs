import accelo from "../../accelo.app.mjs";

export default {
  name: "Create Contact",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "accelo-create-contact",
  description: "Creates a contact. [See docs here](https://api.accelo.com/docs/?_ga=2.136158329.97118171.1674049767-1568937371.1674049767#create-a-contact)",
  type: "action",
  props: {
    accelo,
    companyId: {
      propDefinition: [
        accelo,
        "companyId",
      ],
    },
    firstname: {
      label: "First Name",
      description: "The contact's first name",
      type: "string",
    },
    middlename: {
      label: "Middle Name",
      description: "The contact's middle name",
      type: "string",
      optional: true,
    },
    surname: {
      label: "Surname",
      description: "The contact's surname",
      type: "string",
    },
    username: {
      label: "Username",
      description: "The contact's new username, this must be a unique username",
      type: "string",
      optional: true,
    },
    password: {
      label: "Password",
      description: "The contact's new password for the Accelo deployment",
      type: "string",
      optional: true,
    },
    title: {
      label: "Title",
      description: "The contact's title",
      type: "string",
      optional: true,
    },
    phone: {
      label: "Phone",
      description: "The contact's phone number in their role in the associated company.",
      type: "string",
      optional: true,
    },
    email: {
      label: "Email",
      description: "The contact's email in their role in the associated company.",
      type: "string",
      optional: true,
    },
  },
  async run({ $ }) {
    const { response } = await this.accelo.createContact({
      $,
      data: {
        company_id: this.companyId,
        firstname: this.firstname,
        middlename: this.middlename,
        surname: this.surname,
        username: this.username,
        password: this.password,
        title: this.title,
        phone: this.phone,
        email: this.email,
      },
    });

    if (response) {
      $.export("$summary", `Successfully created contact with id ${response.id}`);
    }

    return response;
  },
};
