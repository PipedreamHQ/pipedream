import app from "../../precisefp.app.mjs";

export default {
  key: "precisefp-create-account",
  name: "Create Account",
  description: "Create a new account. [See the documentation](https://documenter.getpostman.com/view/6125750/UyrDEFnd#b6db56e1-2767-499e-9928-38c82f3bd3e6)",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    accountType: {
      type: "string",
      label: "Account Type",
      description: "The type of account. `CLIENT` or `PROSPECT`.",
      options: [
        "CLIENT",
        "PROSPECT",
      ],
    },
    clientFirstName: {
      type: "string",
      label: "First Name",
      description: "The first name of the client.",
    },
    clientLastName: {
      type: "string",
      label: "Last Name",
      description: "The last name of the client.",
    },
    clientEmail: {
      type: "string",
      label: "Email",
      description: "The email address of the client.",
    },
    clientPhoneCountry: {
      type: "string",
      label: "Phone Country",
      description: "The 2 letter country code of the client. Eg. `US`.",
      optional: true,
    },
    clientPhoneCode: {
      type: "string",
      label: "Phone Code",
      description: "Country calling code of the client. Eg. `+1`",
      optional: true,
    },
    clientPhoneNumber: {
      type: "string",
      label: "Phone Number",
      description: "Phone number of the client. Eg. `3213211212`",
      optional: true,
    },
    coClientFirstName: {
      type: "string",
      label: "Co-Client First Name",
      description: "The first name of the co-client.",
      optional: true,
    },
    coClientLastName: {
      type: "string",
      label: "Co-Client Last Name",
      description: "The last name of the co-client.",
      optional: true,
    },

    coClientEmail: {
      type: "string",
      label: "Co-Client Email",
      description: "The email address of the co-client.",
      optional: true,
    },
    coClientPhoneCountry: {
      type: "string",
      label: "Co-Client Phone Country",
      description: "2 letter country code. Eg. `US`",
      optional: true,
    },
    coClientPhoneCode: {
      type: "string",
      label: "Co-Client Phone Code",
      description: "Country calling code. Eg. `+1`",
      optional: true,
    },
    coClientPhoneNumber: {
      type: "string",
      label: "Co-Client Phone Number",
      description: "Phone number. Eg. `3213211212`",
      optional: true,
    },
  },
  methods: {
    createAccount(args = {}) {
      return this.app.post({
        path: "/accounts",
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const {
      createAccount,
      accountType,
      clientFirstName,
      clientLastName,
      clientEmail,
      clientPhoneCountry,
      clientPhoneCode,
      clientPhoneNumber,
      coClientFirstName,
      coClientLastName,
      coClientEmail,
      coClientPhoneCountry,
      coClientPhoneCode,
      coClientPhoneNumber,
    } = this;

    const response = await createAccount({
      step,
      data: {
        type: accountType,
        client: {
          first_name: clientFirstName,
          last_name: clientLastName,
          email: clientEmail,
          phone: {
            country: clientPhoneCountry,
            code: clientPhoneCode,
            number: clientPhoneNumber,
          },
        },
        coclient: {
          first_name: coClientFirstName,
          last_name: coClientLastName,
          email: coClientEmail,
          phone: {
            country: coClientPhoneCountry,
            code: coClientPhoneCode,
            number: coClientPhoneNumber,
          },
        },
      },
    });

    step.export("$summary", `Successfully created account with ID ${response.id}`);

    return response;
  },
};
