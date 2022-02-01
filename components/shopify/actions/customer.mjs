import { toSingleLineString } from "./commons.mjs";

export default {
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
  address: {
    type: "string",
    label: "Street Address",
    description: "The customer's mailing address",
    optional: true,
  },
  company: {
    type: "string",
    label: "Company",
    description: "The customer's company",
    optional: true,
  },
  city: {
    type: "string",
    label: "City",
    description: "The customer's city, town, or village",
    optional: true,
  },
  province: {
    type: "string",
    label: "Province",
    description: "The customer's region name. Typically a province, a state, or a prefecture",
    optional: true,
  },
  country: {
    type: "string",
    label: "Country",
    description: "The customer's country",
    optional: true,
  },
  zip: {
    type: "string",
    label: "Zip Code",
    description: "The customer's postal code",
    optional: true,
  },
  sendEmailInvite: {
    type: "boolean",
    label: "Send Email Invite",
    description: "Send email invite to address",
    optional: true,
  },
};
