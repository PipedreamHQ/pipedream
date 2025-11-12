import { ConfigurationError } from "@pipedream/platform";
import app from "../../afosto.app.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "afosto-add-information-to-cart",
  name: "Add Information to Cart",
  description: "Add customer information to a cart. [See the documentation](https://afosto.com/docs/developers/storefront-js-client/custom-checkout/collecting-customer-data/)",
  version: "0.0.3",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    cartId: {
      propDefinition: [
        app,
        "cartId",
      ],
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email of the customer",
      optional: true,
    },
    isGuest: {
      type: "boolean",
      label: "Is Guest",
      description: "Whether the customer is a guest",
      optional: true,
    },
    givenName: {
      type: "string",
      label: "Given Name",
      description: "The given name of the customer",
      optional: true,
    },
    additionalName: {
      type: "string",
      label: "Additional Name",
      description: "The additional name of the customer",
      optional: true,
    },
    familyName: {
      type: "string",
      label: "Family Name",
      description: "The family name of the customer",
      optional: true,
    },
    organisationName: {
      type: "string",
      label: "Organisation Name",
      description: "The name of the organisation",
      optional: true,
    },
    organisationIsGuest: {
      type: "boolean",
      label: "Organisation Is Guest",
      description: "Whether the organisation is a guest",
      optional: true,
    },
    organisationEmail: {
      type: "string",
      label: "Organisation Email",
      description: "The email of the organisation",
      optional: true,
    },
    organisationCountryCode: {
      type: "string",
      label: "Organisation Country Code",
      description: "The country code of the organisation",
      optional: true,
    },
    organisationNumber: {
      type: "string",
      label: "Organisation Number",
      description: "The number of the organisation",
      optional: true,
    },
    countryCode: {
      type: "string",
      label: "Phone Number Country Code",
      description: "The country code of the phone number",
      optional: true,
    },
    number: {
      type: "string",
      label: "Phone Number",
      description: "The number of the phone number",
      optional: true,
    },
    shippingAddressData: {
      type: "object",
      label: "Shipping Address Data",
      description: "The shipping address data. **E.g. {\"country_code\": \"US\", \"postal_code\": \"10001\", \"address_line_1\": \"123 Main St\", \"given_name\": \"John\", \"family_name\": \"Smith\", \"organisation\": \"Organization Name\"}** [See the documentation](https://afosto.com/docs/developers/storefront-js-client/custom-checkout/collecting-customer-data/)",
    },
    billingAddressData: {
      type: "object",
      label: "Billing Address Data",
      description: "The billing address data. **E.g. {\"country_code\": \"US\", \"postal_code\": \"10001\", \"address_line_1\": \"123 Main St\", \"given_name\": \"John\", \"family_name\": \"Smith\", \"organisation\": \"Organization Name\"}** [See the documentation](https://afosto.com/docs/developers/storefront-js-client/custom-checkout/collecting-customer-data/)",
    },
  },
  async run({ $ }) {
    const cartId = this.cartId;

    const phoneNumberData = {
      country_code: this.countryCode,
      number: this.number,
    };

    const parsedBillingAddressData = parseObject(this.billingAddressData);

    const variables = {
      customerInput: {
        cart_id: cartId,
        customer: {
          contact: {
            email: this.email,
            is_guest: this.isGuest,
            given_name: this.givenName,
            additional_name: this.additionalName,
            family_name: this.familyName,
            phone_numbers: [
              phoneNumberData,
            ],
          },
          organisation: {
            name: this.organisationName,
            is_guest: this.organisationIsGuest,
            administration: {
              email: this.organisationEmail,
            },
            registration: {
              country_code: this.organisationCountryCode,
              number: this.organisationNumber,
            },
          },
        },
      },
      phoneNumberInput: {
        cart_id: cartId,
        phone_number: phoneNumberData,
      },
      shippingAddressInput: {
        address: parseObject(this.shippingAddressData),
        cart_id: cartId,
        type: "ADDRESS",
      },
      billingAddressInput: {
        address: parsedBillingAddressData,
        cart_id: cartId,
      },
      countryCode: parsedBillingAddressData?.country_code,
      postalCode: parsedBillingAddressData?.postal_code,
    };

    const response = await this.app.addInformationToCart({
      $,
      variables,
    });

    if (response.errors) {
      throw new ConfigurationError(JSON.stringify(response.errors[0]));
    }

    $.export("$summary", `Successfully added information to cart with ID: ${this.cartId}`);
    return response.data;
  },
};
