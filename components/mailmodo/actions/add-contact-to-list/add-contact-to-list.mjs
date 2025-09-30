import app from "../../mailmodo.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "mailmodo-add-contact-to-list",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  name: "Add Contact To List",
  description: "Adds a contact to a list [See the docs here](https://api.salesflare.com/docs#operation/postAccountsAccount_idContacts)",
  props: {
    app,
    listName: {
      propDefinition: [
        app,
        "listName",
      ],
    },
    email: {
      propDefinition: [
        app,
        "email",
      ],
    },
    firstName: {
      type: "string",
      label: "Firstname",
      description: "Firstname of the contact",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Lastname",
      description: "Lastname of the contact",
      optional: true,
    },
    name: {
      type: "string",
      label: "Name",
      description: "Name of the contact",
      optional: true,
    },
    gender: {
      type: "string",
      label: "Gender",
      description: "Gender of the contact",
      optional: true,
    },
    age: {
      type: "integer",
      label: "Age",
      description: "Age of the contact",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "Phone of the contact",
      optional: true,
    },
    address1: {
      type: "string",
      label: "Address",
      description: "Address",
      optional: true,
    },
    address2: {
      type: "string",
      label: "Address(more)",
      description: "Address(more)",
      optional: true,
    },
    city: {
      type: "string",
      label: "City",
      description: "City",
      optional: true,
    },
    state: {
      type: "string",
      label: "State",
      description: "State",
      optional: true,
    },
    country: {
      type: "string",
      label: "Country",
      description: "Country",
      optional: true,
    },
    postalCode: {
      type: "string",
      label: "Postal Code",
      description: "Postal code",
      optional: true,
    },
    designation: {
      type: "string",
      label: "Designation",
      description: "Designation",
      optional: true,
    },
    company: {
      type: "string",
      label: "Company",
      description: "Company",
      optional: true,
    },
    industry: {
      type: "string",
      label: "Industry",
      description: "Industry",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "Description",
      optional: true,
    },
  },
  async run ({ $ }) {
    const pairs = {
      firstName: "first_name",
      lastName: "last_name",
      postalCode: "postal_code",
    };
    const {
      listName, email, ...data
    } = utils.extractProps(this, pairs);
    const resp = await this.app.addContactToList({
      $,
      data: {
        listName,
        email,
        data,
      },
    });
    $.export("$summary", resp.message);
    return resp;
  },
};
