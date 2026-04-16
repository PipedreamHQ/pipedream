import { ConfigurationError } from "@pipedream/platform";
import { LOCALE_OPTIONS } from "../../common/constants.mjs";
import { getId } from "../../common/utils.mjs";
import freeagent from "../../freeagent.app.mjs";

export default {
  key: "freeagent-create-contact",
  name: "Create Contact",
  description: "Create a contact in FreeAgent. [See the documentation](https://dev.freeagent.com/docs/contacts#create-a-contact).",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    freeagent,
    firstName: {
      type: "string",
      label: "First Name",
      description: "The first name of the contact. Required if `Organisation Name` is not provided.",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The last name of the contact. Required if `Organisation Name` is not provided.",
      optional: true,
    },
    organisationName: {
      type: "string",
      label: "Organisation Name",
      description: "The name of the organisation. Required if `First Name` and `Last Name` are not provided.",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email of the contact",
      optional: true,
    },
    billingEmail: {
      type: "string",
      label: "Billing Email",
      description: "The billing email of the contact",
      optional: true,
    },
    phoneNumber: {
      type: "string",
      label: "Phone Number",
      description: "The phone number of the contact",
      optional: true,
    },
    mobile: {
      type: "string",
      label: "Mobile",
      description: "The mobile number of the contact",
      optional: true,
    },
    address1: {
      type: "string",
      label: "Address 1",
      description: "The first address line of the contact",
      optional: true,
    },
    address2: {
      type: "string",
      label: "Address 2",
      description: "The second address line of the contact",
      optional: true,
    },
    address3: {
      type: "string",
      label: "Address 3",
      description: "The third address line of the contact",
      optional: true,
    },
    town: {
      type: "string",
      label: "Town / City",
      description: "The town or city of the contact",
      optional: true,
    },
    region: {
      type: "string",
      label: "Region / State",
      description: "The region or state of the contact",
      optional: true,
    },
    postcode: {
      type: "string",
      label: "Postcode / ZIP",
      description: "The postcode or ZIP code of the contact",
      optional: true,
    },
    country: {
      type: "string",
      label: "Country",
      description: "The country of the contact",
      optional: true,
    },
    contactNameOnInvoices: {
      type: "boolean",
      label: "Contact Name on Invoices",
      description: "If true, the contact name will be shown on invoices as well as the organization name.",
      optional: true,
    },
    defaultPaymentTermsInDays: {
      type: "integer",
      label: "Default Payment Terms (Days)",
      description: "The default payment terms in days for the contact",
      optional: true,
    },
    locale: {
      type: "string",
      label: "Locale",
      description: "Invoice/Estimate language",
      optional: true,
      options: LOCALE_OPTIONS,
    },
  },
  async run({ $ }) {
    const hasOrg = this.organisationName;
    const hasPerson = this.firstName && this.lastName;
    if (!hasOrg && !hasPerson) {
      throw new ConfigurationError("Provide either `Organisation Name` OR both `First Name` and `Last Name`.");
    }

    const response = await this.freeagent.createContact({
      $,
      data: {
        first_name: this.firstName,
        last_name: this.lastName,
        organisation_name: this.organisationName,
        email: this.email,
        billing_email: this.billingEmail,
        phone_number: this.phoneNumber,
        mobile: this.mobile,
        address1: this.address1,
        address2: this.address2,
        address3: this.address3,
        town: this.town,
        region: this.region,
        postcode: this.postcode,
        country: this.country,
        contact_name_on_invoices: this.contactNameOnInvoices,
        default_payment_terms_in_days: this.defaultPaymentTermsInDays,
        locale: this.locale,
      },
    });
    $.export("$summary", `Successfully created contact with ID: \`${getId(response.contact.url)}\``);
    return response;
  },
};

