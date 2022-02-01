import shopify from "../../shopify.app.mjs";
import { toSingleLineString } from "../commons.mjs";

export default {
  key: "shopify-create-customer",
  name: "Create Customer",
  description: "Create a new customer. [See the docs](https://shopify.dev/api/admin-rest/2022-01/resources/customer#[post]/admin/api/2022-01/customers.json)",
  version: "0.0.1",
  type: "action",
  props: {
    shopify,
    firstName: {
      type: "string",
      label: "First Name",
      description: "The customer's first name",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The customer's last name",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "The unique email address of the customer",
    },
    phone: {
      type: "string",
      label: "Phone Number",
      description: toSingleLineString(`
        The unique phone number (E.164 format) for this customer.
        Check out [Shopify Customer API](https://shopify.dev/api/admin-rest/2022-01/resources/customer#[post]/admin/api/#{api_version}/customers.json_examples) for more details on valid formats
      `),
      optional: true,
    },
    addresses: {
      type: "string[]",
      label: "Addresses",
      description: toSingleLineString(`
        A list of the ten most recently updated addresses for the customer.
        Example: \`[{"address1":"123 Oak St","city":"Ottawa","province":"ON","phone":"555-1212","zip":"123 ABC","last_name":"Lastnameson","first_name":"Mother","country":"CA"}]\`.
        Check out [Shopify Customer API](https://shopify.dev/api/admin-rest/2022-01/resources/customer#[post]/admin/api/#{api_version}/customers.json_examples) for more details on addresses
      `),
      optional: true,
    },
    password: {
      type: "string",
      secret: true,
      label: "Password",
      description: "Password for customer account",
      optional: true,
    },
    passwordConfirmation: {
      type: "string",
      secret: true,
      label: "Password Confirmation",
      description: "Password confirmation for customer account",
      optional: true,
    },
    sendEmailInvite: {
      type: "boolean",
      label: "Send Email Invite",
      description: "Send email invite to address",
      optional: true,
    },
    metafields: {
      type: "string[]",
      label: "Metafields",
      description: toSingleLineString(`
        A list of objects representing metafields.
        Check out [Shopify Customer API](https://shopify.dev/api/admin-rest/2022-01/resources/customer#[post]/admin/api/#{api_version}/customers.json_examples) for more details on metafields
      `),
      optional: true,
    },
  },
  async run({ $ }) {
    let data = {
      first_name: this.firstName,
      last_name: this.lastName,
      email: this.email,
      phone: this.phone,
      addresses: this.shopify.parseArrayOfJSONStrings(this.addresses),
      password: this.password,
      password_confirmation: this.passwordConfirmation,
      send_email_invite: this.sendEmailInvite,
      metafields: this.shopify.parseArrayOfJSONStrings(this.metafields),
    };

    let response = await this.shopify.createCustomer(data);
    $.export("$summary", `Created new customer \`${this.email}\` with id \`${response.id}\``);
    return response;
  },
};
