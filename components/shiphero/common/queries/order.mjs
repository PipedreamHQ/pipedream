import { gql } from "graphql-request";

export default {
  getOrder: gql`
    query getOrder(
      $orderId: String!
      $analyze: Boolean
    ) {
      order(
        id: $orderId
        analyze: $analyze
      ) {
        request_id
        data {
          id
          order_number
          partner_order_id
          shop_name
          fulfillment_status
          order_date
          total_tax
          subtotal
          total_discounts
          total_price
          box_name
          auto_print_return_label
          custom_invoice_url
          account_id
          updated_at
          email
          profile
          gift_note
          packing_note
          required_ship_date
          tags
          priority_flag
          attachments {
            pageInfo {
              hasNextPage
              hasPreviousPage
              startCursor
              endCursor
            }
            total_count
            edges {
              cursor
              node {
                id
                url
                description
                filename
                file_type
                file_size
                created_at
              }
            }
          }
        }
      }
    }
  `,
  listOrders: gql`
    query listOrders(
      $shopName: String
      $orderNumber: String
      $warehouseId: String
      $sku: String
      $email: String
      $updatedFrom: ISODateTime
      $updatedTo: ISODateTime
      $orderDateFrom: ISODateTime
      $orderDateTo: ISODateTime
      $customerAccountId: String
      $analyze: Boolean
      $sort: String
      $before: String
      $after: String
      $first: Int
      $last: Int
    ) {
      orders(
        shop_name: $shopName
        order_number: $orderNumber
        warehouse_id: $warehouseId
        sku: $sku
        email: $email
        updated_from: $updatedFrom
        updated_to: $updatedTo
        order_date_from: $orderDateFrom
        order_date_to: $orderDateTo
        customer_account_id: $customerAccountId
        analyze: $analyze
      ) {
        request_id
        data (
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
            cursor
            node {
              id
              order_number
              shop_name
              order_date
            }
          }
        }
      }
    }
  `,
};
