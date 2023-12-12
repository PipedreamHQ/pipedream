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

export default {
  mutations: {
    saveUrl,
  },
};
