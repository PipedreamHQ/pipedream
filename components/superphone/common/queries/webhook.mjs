import { gql } from "graphql-request";

const createWebhook = gql`
  mutation createWebhook($input: WebhookCreateInput!) {
    createWebhook(input: $input) {
      webhook {
        id
        subscriptions
        url
        active
      }
    }
  }
`;

const updateWebhook = gql`
  mutation updateWebhook($input: WebhookUpdateInput!) {
    updateWebhook(input: $input) {
      webhook {
        id
        subscriptions
        url
        active
      }
    }
  }
`;

export default {
  mutations: {
    createWebhook,
    updateWebhook,
  },
};
