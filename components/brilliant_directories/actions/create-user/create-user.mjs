import qs from "qs";
import app from "../../brilliant_directories.app.mjs";

export default {
  key: "brilliant_directories-create-user",
  name: "Create User",
  description: "Creates a new user record in the website database. [See the documentation](https://support.brilliantdirectories.com/support/solutions/articles/12000088887-api-overview-and-testing-the-api-from-admin-area)",
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
      description: "The first name for the new user.",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The last name for the new user.",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email address for the new user.",
    },
    password: {
      type: "string",
      label: "Password",
      description: "The password for the new user.",
    },
    subscriptionId: {
      type: "string",
      label: "Subscription ID",
      description: "The subscription ID associated with the new user.",
    },
    company: {
      type: "string",
      label: "Company",
      description: "The company for the new user.",
      optional: true,
    },
    phoneNumber: {
      type: "string",
      label: "Phone Number",
      description: "The phone number to the new user.",
      optional: true,
    },
    address1: {
      type: "string",
      label: "Address 1",
      description: "The address 1 for the new user.",
      optional: true,
    },
    address2: {
      type: "string",
      label: "Address 2",
      description: "The address 2 for the new user.",
      optional: true,
    },
    city: {
      type: "string",
      label: "City",
      description: "The city for the new user.",
      optional: true,
    },
    zipCode: {
      type: "string",
      label: "Zip Code",
      description: "The zip code for the new user.",
      optional: true,
    },
    stateCode: {
      type: "string",
      label: "State Code",
      description: "The state code for the new user.",
      optional: true,
    },
    countryCode: {
      type: "string",
      label: "Country Code",
      description: "The country code for the new user.",
      optional: true,
    },
    website: {
      type: "string",
      label: "Website",
      description: "The website for the new user.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      app,
      firstName,
      lastName,
      subscriptionId,
      phoneNumber,
      zipCode,
      stateCode,
      countryCode,
      ...data
    } = this;

    const response = await app.createUser({
      data: qs.stringify({
        ...data,
        first_name: firstName,
        last_name: lastName,
        subscription_id: subscriptionId,
        phone_number: phoneNumber,
        zip_code: zipCode,
        state_code: stateCode,
        country_code: countryCode,
      }),
    });

    $.export("$summary", `Successfully created a new user with email ${this.email}`);
    return response;
  },
};
