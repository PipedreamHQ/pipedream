import { gql } from "graphql-request";

export default {
  createWebhook: gql`
    mutation createWebhook(
      $name: String!
      $url: String!
      $shopName: String!
    ) {
      webhook_create(
        data: {
          name: $name,
          url: $url,
          shop_name: $shopName
        }
      ) {
        request_id
        webhook {
          id
          account_id
          shop_name
          url
          name
          source
          shared_signature_secret
        }
      }
    }
  `,
  deleteWebhook: gql`
    mutation deleteWebhook(
      $name: String!
      $shopName: String!
    ) {
      webhook_delete(
        data: {
          name: $name
          shop_name: $shopName
        }
      ) {
        request_id
      }
    }
  `,
};
