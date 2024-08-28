import { gql } from "graphql-request";

export default {
  listProducts: gql`
    query listProducts(
      $sku: String
      $createdFrom: ISODateTime
      $createdTo: ISODateTime
      $updatedFrom: ISODateTime
      $updatedTo: ISODateTime
      $customerAccountId: String
      $hasKits: Boolean
      $analyze: Boolean
      $sort: String
      $before: String
      $after: String
      $first: Int
      $last: Int
    ) {
      products(
        sku: $sku
        created_from: $createdFrom
        created_to: $createdTo
        updated_from: $updatedFrom
        updated_to: $updatedTo
        customer_account_id: $customerAccountId
        has_kits: $hasKits
        analyze: $analyze
      ) {
        request_id
        data(
          sort: $sort
          before: $before
          after: $after
          first: $first
          last: $last
        ) {
          pageInfo {
            hasNextPage
            hasPreviousPage
            startCursor
            endCursor
          }
          edges {
            node {
              id
              legacy_id
              account_id
              name
              sku
              barcode
              country_of_manufacture
              tariff_code
              kit
              kit_build
              no_air
              final_sale
              customs_value
              customs_description
              not_owned
              dropship
              needs_serial_number
              thumbnail
              large_thumbnail
              created_at
              updated_at
              product_note
              virtual
              ignore_on_invoice
              ignore_on_customs
              needs_lot_tracking
              images {
                src
                position
              }
              tags
              vendors {
                vendor_id
                vendor_sku
                price
              }
              packer_note
            }
          }
        }
      }
    }
  `,
};
