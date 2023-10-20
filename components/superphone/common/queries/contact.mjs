import { gql } from "graphql-request";

const contacFields = gql`
  {
    id
    firstName
    lastName
    mobile
    email
    birthday
    twitter
    instagram
    linkedin
    jobTitle
    country
    province
    city
    zipCode
    createdAt
  }
`;

const listContacts = gql`
  query listContacts($first: Int, $after: String, $last: Int, $before: String) {
    contacts(first: $first, after: $after, last: $last, before: $before) {
      nodes ${contacFields}
      total
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

const createContact = gql`
  mutation createContact($input: ContactCreateInput!) {
    createContact(input: $input) {
      contact ${contacFields}
      contactUserErrors {
        field
        message
      }
    }
  }
`;

const updateContact = gql`
  mutation updateContact($input: ContactUpdateInput!) {
    updateContact(input: $input) {
      contact ${contacFields}
      contactUserErrors {
        field
        message
      }
    }
  }
`;

export default {
  mutations: {
    createContact,
    updateContact,
  },
  queries: {
    listContacts,
  },
};
