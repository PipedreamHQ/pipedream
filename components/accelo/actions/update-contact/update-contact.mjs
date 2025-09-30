import accelo from "../../accelo.app.mjs";

export default {
  name: "Update Contact",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "accelo-update-contact",
  description: "Updates a contact. [See docs here](https://api.accelo.com/docs/?_ga=2.136158329.97118171.1674049767-1568937371.1674049767#update-a-contact)",
  type: "action",
  props: {
    accelo,
    contactId: {
      propDefinition: [
        accelo,
        "contactId",
      ],
    },
    firstname: {
      label: "First Name",
      description: "The contact's first name",
      type: "string",
      optional: true,
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
      optional: true,
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
  },
  async run({ $ }) {
    const { response } = await this.accelo.updateContact({
      $,
      contactId: this.contactId,
      data: {
        firstname: this.firstname,
        middlename: this.middlename,
        surname: this.surname,
        username: this.username,
        password: this.password,
        title: this.title,
      },
    });

    if (response) {
      $.export("$summary", `Successfully updated contact with id ${response.id}`);
    }

    return response;
  },
};
