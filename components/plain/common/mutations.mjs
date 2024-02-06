const createThread = `
  mutation createThread($input: CreateThreadInput!) {
    createThread(input: $input) {
      thread {
        __typename
        id
        customer {
          id
        }
        status
        title
        previewText
        priority
      }
    }
  }
`;

const upsertCustomer = `
  mutation upsertCustomer($input: UpsertCustomerInput!) {
    upsertCustomer(input: $input) {
      result
      customer {
        id
        fullName
        email {
          email
          isVerified
        }
        status
      }
    }
  }
`;

const addCustomerToCustomerGroup = `
  mutation addCustomerToCustomerGroup($input: AddCustomerToCustomerGroupsInput!) {
    addCustomerToCustomerGroups(input: $input) {
      customerGroupMemberships {
        customerGroup {
          id
          name
          key
        }
      }
    }
  }
`;

const createCustomerEvent = `
  mutation createCustomerEvent($input: CreateCustomerEventInput!) {
    createCustomerEvent(input: $input) {
      customerEvent {
        __typename
        id
        title
        createdAt {
          __typename
          iso8601
          unixTimestamp
        }
      }
    }
  }
`;

const createWebhookTarget = `
  mutation createWebhookTarget($input: CreateWebhookTargetInput!) {
    createWebhookTarget(input: $input) {
      webhookTarget {
        id
        url
        description
        createdAt {
          __typename
          iso8601
          unixTimestamp
        }
      }
    }
  }
`;

const deleteWebhookTarget = `
  mutation deleteWebhookTarget($input: DeleteWebhookTargetInput!) {
    deleteWebhookTarget(input: $input) {
      error {
        message
      }
    }
  }
`;

export default {
  createThread,
  upsertCustomer,
  addCustomerToCustomerGroup,
  createCustomerEvent,
  createWebhookTarget,
  deleteWebhookTarget,
};
