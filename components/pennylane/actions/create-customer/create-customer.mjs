import { ConfigurationError } from "@pipedream/platform";
import {
  CUSTOMER_GENDER_OPTIONS,
  CUSTOMER_TYPE_OPTIONS, PAYMENT_CONDITIONS_OPTIONS,
} from "../../common/constants.mjs";
import { parseObject } from "../../common/utils.mjs";
import pennylane from "../../pennylane.app.mjs";

export default {
  key: "pennylane-create-customer",
  name: "Create Customer",
  description: "Creates a new customer in Pennylane. [See the documentation](https://pennylane.readme.io/reference/customers-post-1)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    pennylane,
    customerType: {
      type: "string",
      label: "Customer Type",
      description: "The type of the customer you want to create.",
      options: CUSTOMER_TYPE_OPTIONS,
      reloadProps: true,
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "Customer first name.",
      hidden: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Customer last name.",
      hidden: true,
    },
    gender: {
      type: "string",
      label: "Gender",
      description: "Customer Gender",
      options: CUSTOMER_GENDER_OPTIONS,
      hidden: true,
      optional: true,
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the company.",
      hidden: true,
    },
    regNo: {
      type: "string",
      label: "Reg No",
      description: "Customer registration number (SIREN).",
      hidden: true,
      optional: true,
    },
    address: {
      type: "string",
      label: "Address",
      description: "Customer address (billing address).",
    },
    postalCode: {
      type: "string",
      label: "Postal Code",
      description: "Postal code (billing address).",
    },
    city: {
      type: "string",
      label: "City",
      description: "City (billing address).",
    },
    country: {
      type: "string",
      label: "Country",
      description: "Any ISO 3166 Alpha-2 country code (billing address).",
    },
    recipient: {
      type: "string",
      label: "Recipient",
      description: "Recipient displayed in the invoice.",
      hidden: true,
      optional: true,
    },
    vatNumber: {
      type: "string",
      label: "VAT Number",
      description: "Customer's VAT number.",
      hidden: true,
      optional: true,
    },
    sourceId: {
      type: "string",
      label: "Source Id",
      description: "You can use your own id when creating the customer. If not provided, Pennylane will pick one for you. Id must be unique.",
      optional: true,
    },
    emails: {
      type: "string[]",
      label: "Emails",
      description: "A list of customer emails.",
      optional: true,
    },
    billingIban: {
      type: "string",
      label: "Billing IBAN",
      description: "The billing IBAN of the customer. This is the iban on which you wish to receive payment from this customer.",
      optional: true,
    },
    deliveryAddress: {
      type: "string",
      label: "Delivery Address",
      description: "Address (shipping address).",
      optional: true,
    },
    deliveryPostalCode: {
      type: "string",
      label: "Delivery Postal Code",
      description: "Postal code (shipping address).",
      optional: true,
    },
    deliveryCity: {
      type: "string",
      label: "Delivery City",
      description: "City (shipping address).",
      optional: true,
    },
    deliveryCountry: {
      type: "string",
      label: "Delivery Country",
      description: "Any ISO 3166 Alpha-2 country code (shipping address).",
      optional: true,
    },
    paymentConditions: {
      type: "string",
      label: "Payment Conditions",
      description: "Customer payment conditions",
      options: PAYMENT_CONDITIONS_OPTIONS,
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "Customer phone number.",
      optional: true,
    },
    reference: {
      type: "string",
      label: "Reference",
      description: "This reference doesn't appear on the invoice.",
      optional: true,
    },
    notes: {
      type: "string",
      label: "Notes",
      description: "Notes about the customer.",
      optional: true,
    },
    mandate: {
      type: "object",
      label: "Mandate",
      description: "The mandate object. **Example: {\"provider\": \"gocardless\",\"source_id\": \"MD001H23WP8E7XN\"}**.",
      optional: true,
    },
    planItem: {
      type: "object",
      label: "Plan Item",
      description: "The plan item object. **Example: {\"enabled\": true,\"number\": \"123\",\"label\": \"label\",\"vat_rate\": \"123\",\"country_alpha2\": \"US\",\"description\": \"description\"}**.",
      optional: true,
    },
  },
  async additionalProps(props) {
    const typeCompany = (this.customerType === "company");
    props.name.hidden = !typeCompany;
    props.regNo.hidden = !typeCompany;
    props.recipient.hidden = !typeCompany;
    props.vatNumber.hidden = !typeCompany;
    props.firstName.hidden = typeCompany;
    props.lastName.hidden = typeCompany;
    props.gender.hidden = typeCompany;
    return {};
  },
  async run({ $ }) {
    try {
      const additionalData = this.customerType === "company"
        ? {
          name: this.name,
          reg_no: this.regNo,
          vat_number: this.vatNumber,
          recipient: this.recipient,
        }
        : {
          first_name: this.firstName,
          last_name: this.lastName,
          gender: this.gender,
        };

      const response = await this.pennylane.createCustomer({
        $,
        data: {
          customer: {
            customer_type: this.customerType,
            address: this.address,
            postal_code: this.postalCode,
            city: this.city,
            country_alpha2: this.country,
            source_id: this.sourceId,
            emails: parseObject(this.emails),
            billing_iban: this.billingIban,
            delivery_address: this.deliveryAddress,
            delivery_postal_code: this.deliveryPostalCode,
            delivery_city: this.deliveryCity,
            delivery_country_alpha2: this.deliveryCountry,
            payment_conditions: this.paymentConditions,
            phone: this.phone,
            reference: this.reference,
            notes: this.notes,
            mandate: parseObject(this.mandate),
            plan_item: parseObject(this.planItem),
            ...additionalData,
          },
        },
      });
      $.export("$summary", `Successfully created customer with Id: ${response.customer.source_id}`);
      return response;
    } catch ({ response }) {
      throw new ConfigurationError(response?.data?.message || response?.data?.error);
    }
  },
};
