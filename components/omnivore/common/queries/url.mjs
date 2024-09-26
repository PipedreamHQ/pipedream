import { gql } from "graphql-request";

const saveUrl = gql`
  mutation saveUrl($input: SaveUrlInput!) {
    saveUrl(input: $input) {
      ... on SaveSuccess {
        url
        clientRequestId
      }
      ... on SaveError {
        errorCodes
        message
      }
    }
  }
`;

const savePage = gql`
  mutation savePage($input: SavePageInput!) {
    savePage(input: $input) {
      ... on SaveSuccess {
        url
        clientRequestId
      }
      ... on SaveError {
        errorCodes
        message
      }
    }
  }
`;

export default {
  mutations: {
    savePage,
    saveUrl,
  },
};
