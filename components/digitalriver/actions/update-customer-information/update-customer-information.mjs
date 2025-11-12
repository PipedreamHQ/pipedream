import { COUNTRY_OPTIONS } from "../../common/constants.mjs";
import { clearObj } from "../../common/utils.mjs";
import digitalriver from "../../digitalriver.app.mjs";

export default {
  key: "digitalriver-update-customer-information",
  name: "Update Customer Information",
  description: "Updates the information for a customer in Digital River. [See the documentation](https://www.digitalriver.com/docs/digital-river-api-reference/#tag/Customers/operation/updateCustomers)",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    digitalriver,
    customerId: {
      propDefinition: [
        digitalriver,
        "customerId",
      ],
    },
    email: {
      type: "string",
      label: "Email",
      description: "The customer email address.",
      optional: true,
    },
    line1: {
      type: "string",
      label: "Shipping Address Line 1",
      description: "The first line of the address.",
      optional: true,
    },
    line2: {
      type: "string",
      label: "Shipping Address Line 2",
      description: "The second line of the address.",
      optional: true,
    },
    city: {
      type: "string",
      label: "Shipping Address City",
      description: "The city of the address.",
      optional: true,
    },
    postalCode: {
      type: "string",
      label: "Shipping Address Postal Code",
      description: "The postal code of the address.",
      optional: true,
    },
    state: {
      type: "string",
      label: "Shipping Address State",
      description: "The state, county, province, or region.",
      optional: true,
    },
    country: {
      type: "string",
      label: "Shipping Address Country",
      description: "A [two-letter Alpha-2 country code](https://www.iban.com/country-codes) as described in the [ISO 3166](https://www.iso.org/iso-3166-country-codes.html) international standard.",
      options: COUNTRY_OPTIONS,
      optional: true,
    },
    name: {
      type: "string",
      label: "Shipping Name",
      description: "The recipient's name.",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Shipping Phone",
      description: "The recipient's phone number.",
      optional: true,
    },
    shippingEmail: {
      type: "string",
      label: "Shipping Email",
      description: "The recipient's email address.",
      optional: true,
    },
    organization: {
      type: "string",
      label: "Shipping Organization",
      description: "The recipient's organization.",
      optional: true,
    },
    neighborhood: {
      type: "string",
      label: "Shipping Neighborhood",
      description: "The neighborhood of the address.",
      optional: true,
    },
    division: {
      type: "string",
      label: "Shipping Division",
      description: "A division within an organization.",
      optional: true,
    },
    phoneticName: {
      type: "string",
      label: "Shipping Phonetic Name",
      description: "The phonetic spelling of a name.",
      optional: true,
    },
    companyName: {
      type: "string",
      label: "Tax Certificate Company Name",
      description: "The name of the company that holds the certificate.",
      optional: true,
    },
    taxAuthority: {
      type: "string",
      label: "Tax Certificate Autority",
      description: "The issuing state.",
      optional: true,
    },
    startDate: {
      type: "string",
      label: "Tax Certificate Start Date",
      description: "Tax certificate start date.",
      optional: true,
    },
    endDate: {
      type: "string",
      label: "Tax Certificate End Date",
      description: "Tax certificate end date.",
      optional: true,
    },
    fileId: {
      propDefinition: [
        digitalriver,
        "fileId",
      ],
      label: "Tax Certificate File Id",
      description: "The identifier of the file that contains the tax certificate.",
      optional: true,
    },
    requestToBeForgotten: {
      type: "boolean",
      label: "Request To Be Forgotten",
      description: "If `true`, indicates this customer has submitted a request to be forgotten.",
      optional: true,
    },
    type: {
      type: "string",
      label: "Type",
      description: "The type of customer.",
      options: [
        "business",
        "individual",
      ],
      optional: true,
    },
    metadata: {
      propDefinition: [
        digitalriver,
        "metadata",
      ],
      optional: true,
    },
    locale: {
      type: "string",
      label: "Locale",
      description: "A locale designator that combines the two-letter ISO 639-1 language code with the ISO 3166-1 alpha-2 country code.",
      optional: true,
    },
    enabled: {
      type: "boolean",
      label: "Enabled",
      description: "Usually used to disable the customer. The default is true. If false, attempts to create orders for the customer will fail.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      digitalriver,
      customerId,
      line1,
      line2,
      city,
      postalCode,
      state,
      country,
      name,
      phone,
      shippingEmail,
      organization,
      neighborhood,
      division,
      phoneticName,
      companyName,
      taxAuthority,
      startDate,
      endDate,
      fileId,
      ...data
    } = this;

    const response = await digitalriver.updateCustomer({
      $,
      customerId,
      data: clearObj({
        ...data,
        shipping: {
          address: {
            line1,
            line2,
            city,
            postalCode,
            state,
            country,
          },
          name,
          phone,
          email: shippingEmail,
          organization,
          additionalAddressInfo: {
            neighborhood,
            division,
            phoneticName,
          },
        },
        taxCertificate: {
          companyName,
          taxAuthority,
          startDate,
          endDate,
          fileId,
        },
      }),
    });

    $.export("$summary", `Updated customer information for contact ID ${this.customerId}`);
    return response;
  },
};
