const CREATE_WEBHOOK = `
  mutation webhookSubscriptionCreate(
    $topic: WebhookSubscriptionTopic!,
    $webhookSubscription: WebhookSubscriptionInput!
  ) {
    webhookSubscriptionCreate(
      topic: $topic,
      webhookSubscription: $webhookSubscription
    ) {
      webhookSubscription {
        id
        topic
        filter
        format
        callbackUrl
      }
      userErrors {
        field
        message
      }
    }
  }`;

const DELETE_WEBHOOK = `
  mutation webhookSubscriptionDelete($id: ID!) {
    webhookSubscriptionDelete(id: $id) {
      userErrors {
        field
        message
      }
      deletedWebhookSubscriptionId
    }
  }
`;

export default {
  CREATE_WEBHOOK,
  DELETE_WEBHOOK,
};
