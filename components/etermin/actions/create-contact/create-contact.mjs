import app from "../../etermin.app.mjs";

export default {
  key: "etermin-create-contact",
  name: "Create Contact",
  description: "Create a new contact on eTermin. [See the documentation](https://app.swaggerhub.com/apis/etermin.net/eTermin-API/1.0.0#/Contact/post_contact)",
  version: "0.0.1",
  annotations: {
    openWorldHint: true,
    destructiveHint: false,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    updateWhenExistsgdt: {
      propDefinition: [
        app,
        "updateWhenExistsgdt",
      ],
    },
    salutation: {
      propDefinition: [
        app,
        "salutation",
      ],
    },
    title: {
      propDefinition: [
        app,
        "title",
      ],
    },
    lastname: {
      propDefinition: [
        app,
        "lastName",
      ],
    },
    firstname: {
      propDefinition: [
        app,
        "firstName",
      ],
    },
    company: {
      propDefinition: [
        app,
        "company",
      ],
    },
    birthday: {
      propDefinition: [
        app,
        "birthday",
      ],
    },
    email: {
      propDefinition: [
        app,
        "email",
      ],
    },
  },
  async run({ $ }) {
    const updateWhenExistsgdt = this.updateWhenExistsgdt === true || this.updateWhenExistsgdt === "true"
      ? 1
      : 0;

    const response = await this.app.createContact({
      $,
      params: {
        updatewhenexistsgdt: updateWhenExistsgdt,
        salutation: this.salutation,
        title: this.title,
        lastname: this.lastname,
        firstname: this.firstname,
        company: this.company,
        birthday: this.birthday,
        email: this.email,
      },
    });
    $.export("$summary", "Successfully created the new contact");
    return response;
  },
};
