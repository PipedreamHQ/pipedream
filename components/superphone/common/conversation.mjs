import { gql } from "graphql-request";

const listConversations = gql`
  query listConversations($first: Int, $after: String, $last: Int, $before: String) {
    conversations(first: $first, after: $after, last: $last, before: $before) {
      nodes {
        id
        participant
        platform
        hidden
        archived
        createdAt
        contact {
          id
          firstName
          lastName
          email
        }
      }
      total
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

const getConversation = gql`
  query getConversation($id: ID!, $first: Int, $after: String, $last: Int, $before: String) {
    conversation(id: $id) {
      id
      participant
      platform
      hidden
      archived
      createdAt
      contact {
        id
        firstName
        lastName
        email
      }
      messages(first: $first, after: $after, last: $last, before: $before) {
        nodes {
          id
          from
          to
          body
          direction
          media {
            url
            contentType
            mediaType
          }
          createdAt
          updateId
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
`;

export default {
  queries: {
    listConversations,
    getConversation,
  },
};
