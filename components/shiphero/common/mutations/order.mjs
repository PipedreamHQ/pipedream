import { gql } from "graphql-request";

export default {
  updateOrder: gql`
    mutation updateOrder(
      $orderId: String!,
      $orderNumber: String,
      $partnerOrderId: String,
      $fulfillmentStatus: String,
      $orderDate: ISODateTime,
      $totalTax: String,
      $subtotal: String,
      $totalDiscounts: String,
      $totalPrice: String,
      $customInvoiceUrl: String,
      $profile: String,
      $giftNote: String,
      $packingNote: String,
      $requiredShipDate: ISODateTime,
      $tags: [String],
      $priorityFlag: Boolean
    ) {
      order_update(
        data: {
          order_id: $orderId,
          order_number: $orderNumber,
          partner_order_id: $partnerOrderId,
          fulfillment_status: $fulfillmentStatus,
          order_date: $orderDate,
          total_tax: $totalTax,
          subtotal: $subtotal,
          total_discounts: $totalDiscounts,
          total_price: $totalPrice,
          custom_invoice_url: $customInvoiceUrl,
          profile: $profile,
          gift_note: $giftNote,
          packing_note: $packingNote,
          required_ship_date: $requiredShipDate,
          tags: $tags,
          priority_flag: $priorityFlag
        }
      ) {
        request_id
        order {
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
};
