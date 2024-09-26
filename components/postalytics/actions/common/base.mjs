import postalytics from "../../postalytics.app.mjs";

export default {
  type: "action",
  props: {
    postalytics,
    firstName: {
      type: "string",
      label: "First Name",
      description: "Recipient's first name must be between 1 and 50 characters long.",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Recipient's last name must be between 1 and 50 characters long.",
    },
    company: {
      type: "string",
      label: "Company",
      description: "If provided, can be up to 100 characters long.",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "If provided, can be up to 100 characters long.",
      optional: true,
    },
    addressStreet: {
      type: "string",
      label: "Address Street",
      description: "Recipient's street, can be up to 100 characters long.",
    },
    addressStreet2: {
      type: "string",
      label: "Address Street 2",
      description: "Recipient's street2, can be up to 100 characters long.",
    },
    addressCity: {
      type: "string",
      label: "Address City",
      description: "Recipient's address, can be up to 100 characters long.",
    },
    addressState: {
      type: "string",
      label: "Address State",
      description: "Recipient's state, must be a 2 letter state short-name code or a valid full state name.",
    },
    addressZip: {
      type: "string",
      label: "Address Zip",
      description: "Recipient's zip code, must be in valid zip format.",
    },
    emailAddress: {
      type: "string",
      label: "Email Address",
      description: "Recipient's email address up to 100 characters long",
      optional: true,
    },
    varField1: {
      type: "string",
      label: "Var Field 1",
      description: "Any string up to 255 characters",
      optional: true,
    },
    varField2: {
      type: "string",
      label: "Var Field 2",
      description: "Any string up to 255 characters",
      optional: true,
    },
    varField3: {
      type: "string",
      label: "Var Field 3",
      description: "Any string up to 255 characters",
      optional: true,
    },
    varField4: {
      type: "string",
      label: "Var Field 4",
      description: "Any string up to 255 characters",
      optional: true,
    },
    varField5: {
      type: "string",
      label: "Var Field 5",
      description: "Any string up to 255 characters",
      optional: true,
    },
    varField6: {
      type: "string",
      label: "Var Field 6",
      description: "Any string up to 255 characters",
      optional: true,
    },
    varField7: {
      type: "string",
      label: "Var Field 7",
      description: "Any string up to 255 characters",
      optional: true,
    },
    varField8: {
      type: "string",
      label: "Var Field 8",
      description: "Any string up to 255 characters",
      optional: true,
    },
    varField9: {
      type: "string",
      label: "Var Field 9",
      description: "Any string up to 255 characters",
      optional: true,
    },
    varField10: {
      type: "string",
      label: "Var Field 10",
      description: "Any string up to 255 characters",
      optional: true,
    },
  },
  async run({ $ }) {
    const fn = this.getFn();
    const objToSend = this.getObject(this,
      {
        data: {
          first_name: this.firstName,
          last_name: this.lastName,
          company: this.company,
          phone: this.phone,
          address_street: this.addressStreet,
          address_street2: this.addressStreet2,
          address_city: this.addressCity,
          address_state: this.addressState,
          address_zip: this.addressZip,
          email_address: this.emailAddress,
          var_field_1: this.varField1,
          var_field_2: this.varField2,
          var_field_3: this.varField3,
          var_field_4: this.varField4,
          var_field_5: this.varField5,
          var_field_6: this.varField6,
          var_field_7: this.varField7,
          var_field_8: this.varField8,
          var_field_9: this.varField9,
          var_field_10: this.varField10,

        },
      });
    const response = await fn(objToSend);

    $.export("$summary", this.getSummary(this));
    return response;
  },
};
