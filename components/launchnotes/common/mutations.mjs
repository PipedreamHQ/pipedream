export default {
  createSubscription: `
    mutation CreateSubscription($input: CreateSubscriptionInput!) {
      createSubscription(
        input: $input
      ) {
        clientMutationId
        errors {
          message
          path
        }
        subscription {
          id
        }
      }
    }
  `,
  createAnnouncement: `
    mutation CreateAnnouncement($input: CreateAnnouncementInput!) {
      createAnnouncement(
        input: $input
      ) {
        clientMutationId
        errors {
          message
          path
        }
        announcement {
          id
        }
      }
    }
  `,
  createWebhook: `
    mutation CreateWebhook(
      $name: String!,
      $url: String!,
      $username: String,
      $password: String,
      $owner: ID!,
      $eventTypes: [ID!]!
    ) {
      createOutboundWebhook(
        input: {
          ownerId: $owner,
          name: $name,
          url: $url,
          username: $username,
          password: $password,
          eventTypes: $eventTypes}
      ) {
        outboundWebhook {
          id
        }
      }
    }
  `,
};
