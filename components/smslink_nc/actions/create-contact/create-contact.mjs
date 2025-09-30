import app from "../../smslink_nc.app.mjs";

export default {
  key: "smslink_nc-create-contact",
  name: "Create Contact",
  description: "Create a new contact. [See the documentation](https://api.smslink.nc/api/documentation#/Contact/556b84f384422939a9db51e60685798a).",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
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
    param1: {
      type: "string",
      label: "Param 1",
      description: "Custom parameter 1.",
      optional: true,
    },
    param2: {
      type: "string",
      label: "Param 2",
      description: "Custom parameter 2.",
      optional: true,
    },
    param3: {
      type: "string",
      label: "Param 3",
      description: "Custom parameter 3.",
      optional: true,
    },
  },
  methods: {
    createContact(args = {}) {
      return this.app.post({
        path: "/contact",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      createContact,
      phoneNumber,
      email,
      firstName,
      lastName,
      param1,
      param2,
      param3,
    } = this;

    const response = await createContact({
      $,
      data: {
        contacts: [
          {
            phone_number: phoneNumber,
            email,
            first_name: firstName,
            last_name: lastName,
            param_1: param1,
            param_2: param2,
            param_3: param3,
          },
        ],
      },
    });
    $.export("$summary", "Successfully created a new contact.");
    return response;
  },
};
