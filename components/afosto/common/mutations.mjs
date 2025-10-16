const addInformationToCart = `mutation AddInformationToCart(
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
              pickup_points(postal_code: $postalCode, country_code: $countryCode) {
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
`;

const addItemToCart = `mutation AddItemToCart(
    $input: AddItemsToCartInput!
  ) {
    addItemsToCart(input: $input) {
      cart {
        id
        items {
          ids
          label
          brand
          mpn
          gtin
          image
          hs_code
          country_of_origin
          url
          sku
          quantity
          subtotal
          total
          parent_id
        }
      }
    }
  }
`;

const addNoteToCart = `mutation SetNoteForCart (
    $cartId: String!
    $note: String!
  ) {
    setNoteForCart(input: { cart_id: $cartId, note: $note }) {
      cart {
        id
        number
        total
        subtotal
        total_excluding_vat
        currency
        is_including_vat
        is_vat_shifted
        created_at
        updated_at
      }
    }
  }
`;

const confirmCart = `mutation ConfirmCart (
    $cartId: String!
  ) {
    confirmCart(input: { cart_id: $cartId }) {
      order {
        id
      }
    }
  }
`;

const createCart = `mutation createCart {
  createCart(input: {}) {
    cart {
      id
      number
      total
      subtotal
      total_excluding_vat
      currency
      is_including_vat
      is_vat_shifted
      created_at
    }
  }
}`;

export default {
  addInformationToCart,
  addItemToCart,
  addNoteToCart,
  confirmCart,
  createCart,
};
