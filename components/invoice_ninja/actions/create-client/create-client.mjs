import { CLASSIFICATION_OPTIONS } from "../../common/constants.mjs";
import { parseObject } from "../../common/utils.mjs";
import app from "../../invoice_ninja.app.mjs";

export default {
  key: "invoice_ninja-create-client",
  name: "Create Client",
  description: "Creates a new client in Invoice Ninja. [See the documentation](https://api-docs.invoicing.co/#tag/clients/POST/api/v1/clients)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    contacts: {
      type: "string[]",
      label: "Contacts",
      description: "An array of contact objects in JSON format. **Example: { \"first_name\": \"John\", \"last_name\": \"Smith\", \"email\": \"john@example.com\", \"phone\": \"555-0123\" }**",
    },
    name: {
      type: "string",
      label: "Client Name",
      description: "Name of the client",
      optional: true,
    },
    website: {
      type: "string",
      label: "Website",
      description: "Website of the client",
      optional: true,
    },
    privateNotes: {
      type: "string",
      label: "Private Notes",
      description: "Notes that are only visible to the user who created the client",
      optional: true,
    },
    industryId: {
      propDefinition: [
        app,
        "industryId",
      ],
      optional: true,
    },
    sizeId: {
      propDefinition: [
        app,
        "sizeId",
      ],
      optional: true,
    },
    address1: {
      type: "string",
      label: "Address 1",
      description: "Primary address line for the client",
      optional: true,
    },
    address2: {
      type: "string",
      label: "Address 2",
      description: "Secondary address line for the client",
      optional: true,
    },
    city: {
      type: "string",
      label: "City",
      description: "City of the client",
      optional: true,
    },
    state: {
      type: "string",
      label: "State",
      description: "State of the client",
      optional: true,
    },
    postalCode: {
      type: "string",
      label: "Postal Code",
      description: "Postal code of the client",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "Phone number of the client",
      optional: true,
    },
    countryId: {
      propDefinition: [
        app,
        "countryId",
      ],
    },
    customValue1: {
      type: "string",
      label: "Custom Value 1",
      description: "A custom field for storing additional information",
      optional: true,
    },
    customValue2: {
      type: "string",
      label: "Custom Value 2",
      description: "A custom field for storing additional information",
      optional: true,
    },
    customValue3: {
      type: "string",
      label: "Custom Value 3",
      description: "A custom field for storing additional information",
      optional: true,
    },
    customValue4: {
      type: "string",
      label: "Custom Value 4",
      description: "A custom field for storing additional information",
      optional: true,
    },
    vatNumber: {
      type: "string",
      label: "VAT Number",
      description: "The client's VAT (Value Added Tax) number, if applicable",
      optional: true,
    },
    idNumber: {
      type: "string",
      label: "ID Number",
      description: "A unique identification number for the client, such as a tax ID or business registration number",
      optional: true,
    },
    number: {
      type: "string",
      label: "Number",
      description: "A system-assigned unique number for the client, typically used for invoicing purposes",
      optional: true,
    },
    shippingAddress1: {
      type: "string",
      label: "Shipping Address 1",
      description: "First line of the client's shipping address",
      optional: true,
    },
    shippingAddress2: {
      type: "string",
      label: "Shipping Address 2",
      description: "Second line of the client's shipping address, if needed",
      optional: true,
    },
    shippingCity: {
      type: "string",
      label: "Shipping City",
      description: "City of the client's shipping address",
      optional: true,
    },
    shippingState: {
      type: "string",
      label: "Shipping State",
      description: "State of the client's shipping address",
      optional: true,
    },
    shippingPostalCode: {
      type: "string",
      label: "Shipping Postal Code",
      description: "Postal code of the client's shipping address",
      optional: true,
    },
    shippingCountryId: {
      propDefinition: [
        app,
        "countryId",
      ],
      label: "Shipping Country ID",
      description: "The ID of the country for the client's shipping address",
      optional: true,
    },
    groupSettingsId: {
      propDefinition: [
        app,
        "groupSettingsId",
      ],
      optional: true,
    },
    isTaxExempt: {
      type: "boolean",
      label: "Is Tax Exempt",
      description: "Flag which defines if the client is exempt from taxes",
      optional: true,
    },
    hasValidVatNumber: {
      type: "boolean",
      label: "Has Valid VAT Number",
      description: "Flag which defines if the client has a valid VAT number",
      optional: true,
    },
    classification: {
      type: "string",
      label: "Classification",
      description: "Classification of the client",
      options: CLASSIFICATION_OPTIONS,
      optional: true,
    },
    settings: {
      type: "object",
      label: "Settings",
      description: "An array of settings objects in JSON format. **Example: {\"currency_id\": 1, \"timezone_id\": 5, \"date_format_id\": 1, \"language_id\": 1}** [See the documentation](https://api-docs.invoicing.co/#tag/clients/POST/api/v1/clients) for further details",
      optional: true,
    },
  },
  async run({ $ }) {
    const { data } = await this.app.createNewClient({
      $,
      data: {
        contacts: parseObject(this.contacts),
        name: this.name,
        website: this.website,
        private_notes: this.privateNotes,
        industry_id: this.industryId,
        size_id: this.sizeId,
        address1: this.address1,
        address2: this.address2,
        city: this.city,
        state: this.state,
        postal_code: this.postalCode,
        phone: this.phone,
        country_id: this.countryId,
        custom_value1: this.customValue1,
        custom_value2: this.customValue2,
        custom_value3: this.customValue3,
        custom_value4: this.customValue4,
        vat_number: this.vatNumber,
        id_number: this.idNumber,
        number: this.number,
        shipping_address1: this.shippingAddress1,
        shipping_address2: this.shippingAddress2,
        shipping_city: this.shippingCity,
        shipping_state: this.shippingState,
        shipping_postal_code: this.shippingPostalCode,
        shipping_country_id: this.shipping_country_id,
        group_settings_id: this.groupSettingsId,
        is_tax_exempt: this.isTaxExempt,
        has_valid_vat_number: this.hasValidVatNumber,
        classification: this.classification,
        settings: parseObject(this.settings),
      },
    });
    $.export("$summary", `Created client: ${data.id}`);
    return data;
  },
};
