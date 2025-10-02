import solveCrm from "../../solve_crm.app.mjs";

export default {
  key: "solve_crm-create-contact",
  name: "Create Contact",
  description: "Create a new contact. [See the docs here](https://solve360.com/api/contacts/)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    solveCrm,
    firstname: {
      type: "string",
      label: "First Name",
      description: "First name of the contact",
      optional: true,
    },
    lastname: {
      type: "string",
      label: "Last Name",
      description: "Last name of the contact",
      optional: true,
    },
    businessemail: {
      type: "string",
      label: "Business Email",
      description: "Business email of the contact",
      optional: true,
    },
    personalemail: {
      type: "string",
      label: "Personal Email",
      description: "Personal email of the contact",
      optional: true,
    },
    cellularphone: {
      type: "string",
      label: "Mobile Phone",
      description: "Mobile phone number of the contact",
      optional: true,
    },
    businessphonedirect: {
      type: "string",
      label: "Business Phone",
      description: "Business phone number of the contact",
      optional: true,
    },
    businessaddress: {
      type: "string",
      label: "Business Address",
      description: "Business address of the contact",
      optional: true,
    },
    homeaddress: {
      type: "string",
      label: "Home Address",
      description: "Home address of the contact",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      firstname,
      lastname,
      businessemail,
      personalemail,
      cellularphone,
      businessphonedirect,
      businessaddress,
      homeaddress,
    } = this;

    const data = {
      firstname,
      lastname,
      businessemail,
      personalemail,
      cellularphone,
      businessphonedirect,
      businessaddress,
      homeaddress,
    };

    const response = await this.solveCrm.createContact({
      data,
    }, $);
    $.export("$summary", `Successfully created contact with ID ${response.item.id}`);
    return response;
  },
};
