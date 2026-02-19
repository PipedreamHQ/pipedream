import coupontools from "../../coupontools.app.mjs";

export default {
  key: "coupontools-create-subaccount",
  name: "Create Subaccount",
  description: "Create a subaccount. [See the documentation](https://docs.coupontools.com/api/account#create-subaccount)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    coupontools,
    email: {
      type: "string",
      label: "Email",
      description: "The email of the subaccount",
    },
    password: {
      type: "string",
      label: "Password",
      description: "If not provided, subaccount will get password configuration email",
      secret: true,
      optional: true,
    },
    status: {
      type: "string",
      label: "Status",
      description: "The status of the subaccount",
      options: [
        "trial",
        "customer",
      ],
      optional: true,
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The first name of the subaccount",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The last name of the subaccount",
      optional: true,
    },
    country: {
      type: "string",
      label: "Country",
      description: "Alpha-2 country code (e.g. US, CA, GB, AU)",
      optional: true,
    },
    companyName: {
      type: "string",
      label: "Company Name",
      description: "The company name of the subaccount",
      optional: true,
    },
    expiryDate: {
      type: "string",
      label: "Expiry Date",
      description: "The expiry date of the subaccount Format: yyyy-MM-dd",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.coupontools.createSubaccount({
      $,
      data: {
        email: this.email,
        password: this.password,
        status: this.status,
        first_name: this.firstName,
        last_name: this.lastName,
        country: this.country,
        company_name: this.companyName,
        expiry_date: this.expiryDate,
      },
    });
    $.export("$summary", `Successfully created subaccount with ID: "${response.subaccount.ID}"`);
    return response;
  },
};
