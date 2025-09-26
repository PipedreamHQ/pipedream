import app from "../../afosto.app.mjs";

export default {
  key: "afosto-add-information-to-cart",
  name: "Add Information to Cart",
  description: "Add customer information to a cart. [See the documentation](https://afosto.com/docs/developers/storefront-js-client/custom-checkout/collecting-customer-data/)",
  version: "0.0.1",
  type: "action",
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
    shippingCountryCode: {
      type: "string",
      label: "Shipping Country Code",
      description: "The country code of the shipping address",
      optional: true,
    },
    shippingLocality: {
      type: "string",
      label: "Shipping Locality",
      description: "The locality of the shipping address",
      optional: true,
    },
    shippingAdministrativeArea: {
      type: "string",
      label: "Shipping Administrative Area",
      description: "The administrative area of the shipping address",
      optional: true,
    },
    shippingPostalCode: {
      type: "string",
      label: "Shipping Postal Code",
      description: "The postal code of the shipping address",
      optional: true,
    },
    shippingAddressLine1: {
      type: "string",
      label: "Shipping Address Line 1",
      description: "The first line of the shipping address",
      optional: true,
    },
    shippingAddressLine2: {
      type: "string",
      label: "Shipping Address Line 2",
      description: "The second line of the shipping address",
      optional: true,
    },
    shippingPremiseNumber: {
      type: "string",
      label: "Shipping Premise Number",
      description: "The premise number of the shipping address",
      optional: true,
    },
    shippingPremiseNumberSuffix: {
      type: "string",
      label: "Shipping Premise Number Suffix",
      description: "The suffix of the premise number of the shipping address",
      optional: true,
    },
    shippingThoroughfare: {
      type: "string",
      label: "Shipping Thoroughfare",
      description: "The thoroughfare of the shipping address",
      optional: true,
    },
    shippingGivenName: {
      type: "string",
      label: "Shipping Given Name",
      description: "The given name of the shipping address",
      optional: true,
    },
    shippingAdditionalName: {
      type: "string",
      label: "Shipping Additional Name",
      description: "The additional name of the shipping address",
      optional: true,
    },
    shippingFamilyName: {
      type: "string",
      label: "Shipping Family Name",
      description: "The family name of the shipping address",
      optional: true,
    },
    shippingOrganisation: {
      type: "string",
      label: "Shipping Organisation",
      description: "The organisation of the shipping address",
      optional: true,
    },
    billingCountryCode: {
      type: "string",
      label: "Billing Country Code",
      description: "The country code of the billing address",
      optional: true,
    },
    billingLocality: {
      type: "string",
      label: "Billing Locality",
      description: "The locality of the billing address",
      optional: true,
    },
    billingAdministrativeArea: {
      type: "string",
      label: "Billing Administrative Area",
      description: "The administrative area of the billing address",
      optional: true,
    },
    billingPostalCode: {
      type: "string",
      label: "Billing Postal Code",
      description: "The postal code of the billing address",
      optional: true,
    },
    billingAddressLine1: {
      type: "string",
      label: "Billing Address Line 1",
      description: "The first line of the billing address",
      optional: true,
    },
    billingAddressLine2: {
      type: "string",
      label: "Billing Address Line 2",
      description: "The second line of the billing address",
      optional: true,
    },
    billingPremiseNumber: {
      type: "string",
      label: "Billing Premise Number",
      description: "The premise number of the billing address",
      optional: true,
    },
    billingPremiseNumberSuffix: {
      type: "string",
      label: "Billing Premise Number Suffix",
      description: "The suffix of the premise number of the billing address",
      optional: true,
    },
    billingThoroughfare: {
      type: "string",
      label: "Billing Thoroughfare",
      description: "The thoroughfare of the billing address",
      optional: true,
    },
    billingGivenName: {
      type: "string",
      label: "Billing Given Name",
      description: "The given name of the billing address",
      optional: true,
    },
    billingAdditionalName: {
      type: "string",
      label: "Billing Additional Name",
      description: "The additional name of the billing address",
      optional: true,
    },
    billingFamilyName: {
      type: "string",
      label: "Billing Family Name",
      description: "The family name of the billing address",
      optional: true,
    },
    billingOrganisation: {
      type: "string",
      label: "Billing Organisation",
      description: "The organisation of the billing address",
      optional: true,
    },
  },
  async run({ $ }) {
    try {
      const cartId = this.cartId;
      const contactData = {
        email: this.email,
        is_guest: this.isGuest,
        given_name: this.givenName,
        additional_name: this.additionalName,
        family_name: this.familyName,
      };
      const organisationData = {
        name: this.organisationName,
        is_guest: this.organisationIsGuest,
        administration: {
          email: this.organisationEmail,
        },
        registration: {
          country_code: this.organisationCountryCode,
          number: this.organisationNumber,
        },
      };
      const phoneNumberData = {
        country_code: this.countryCode,
        number: this.number,
      };
      const shippingAddressData = {
        country_code: this.shippingCountryCode,
        locality: this.shippingLocality,
        administrative_area: this.shippingAdministrativeArea,
        postal_code: this.shippingPostalCode,
        address_line_1: this.shippingAddressLine1,
        address_line_2: this.shippingAddressLine2,
        premise_number: this.shippingPremiseNumber,
        premise_number_suffix: this.shippingPremiseNumberSuffix,
        thoroughfare: this.shippingThoroughfare,
        given_name: this.shippingGivenName,
        additional_name: this.shippingAdditionalName,
        family_name: this.shippingFamilyName,
        organisation: this.shippingOrganisation,
      };
      const billingAddressData = {
        country_code: this.billingCountryCode,
        locality: this.billingLocality,
        administrative_area: this.billingAdministrativeArea,
        postal_code: this.billingPostalCode,
        address_line_1: this.billingAddressLine1,
        address_line_2: this.billingAddressLine2,
        premise_number: this.billingPremiseNumber,
        premise_number_suffix: this.billingPremiseNumberSuffix,
        thoroughfare: this.billingThoroughfare,
        given_name: this.billingGivenName,
        additional_name: this.billingAdditionalName,
        family_name: this.billingFamilyName,
        organisation: this.billingOrganisation,
      };

      const customerData = {
        contact: {
          ...contactData,
          phone_numbers: [
            phoneNumberData,
          ],
        },
        organisation: organisationData,
      };

      const variables = {
        customerInput: {
          cart_id: cartId,
          customer: customerData,
        },
        phoneNumberInput: {
          cart_id: cartId,
          phone_number: phoneNumberData,
        },
        shippingAddressInput: {
          address: shippingAddressData,
          cart_id: cartId,
          type: "ADDRESS",
        },
        billingAddressInput: {
          address: billingAddressData,
          cart_id: cartId,
        },
        countryCode: billingAddressData?.country_code,
        postalCode: billingAddressData?.postal_code,
      };

      const response = await this.app.query({
        $,
        maxBodyLength: Infinity,
        headers: {
          "DisablePreParseMultipartForm": "true",
        },
        data: JSON.stringify({
          query: `mutation AddInformationToCart(
            $customerInput: AddCustomerToCartInput!
            $phoneNumberInput: AddPhoneNumberToCartInput!
            $shippingAddressInput: AddShippingAddressToCartInput!
            $billingAddressInput: AddBillingAddressToCartInput!
            $countryCode: String!
            $postalCode: String!
          ) {
            addCustomerToCart(input: $customerInput) {
              cart {
                customer {
                  contact {
                    id
                    number
                    email
                    is_guest
                    name
                    given_name
                    additional_name
                    family_name
                    created_at
                  }
                }
              }
            }
            addPhoneNumberToCart(input: $phoneNumberInput) {
              cart {
                phone_number {
                  id
                  country_code
                  number
                  national
                  created_at
                }
              }
            }
            addShippingAddressToCart(input: $shippingAddressInput) {
              cart {
                delivery {
                  address {
                    id
                    country_code
                    administrative_area
                    locality
                    postal_code
                    address_line_1
                    address_line_2
                    thoroughfare
                    premise_number
                    premise_number_suffix
                    given_name
                    additional_name
                    family_name
                    created_at
                  }
                }
              }
            }
            addBillingAddressToCart(input: $billingAddressInput) {
              cart {
                billing {
                  address {
                    id
                    country_code
                    administrative_area
                    locality
                    postal_code
                    address_line_1
                    address_line_2
                    thoroughfare
                    premise_number
                    premise_number_suffix
                    given_name
                    additional_name
                    family_name
                    created_at
                  }
                }
                options {
                  shipping {
                    methods {
                      pickup_points(postal_code: $countryCode, country_code: $postalCode) {
                        id
                        name
                        carrier
                        latitude
                        longitude
                        distance
                        address {
                          country_code
                          id
                          postal_code
                        }
                      }
                    }
                  }
                }
              }
            }
          }
          `,
          variables,
        }),
      });

      $.export("$summary", `Successfully added information to cart with ID: ${this.cartId}`);
      return response.data;
    } catch (error) {
      throw new Error(`${error.errors?.[0]?.message || "An unknown error occurred"}`);
    }
  },
};
