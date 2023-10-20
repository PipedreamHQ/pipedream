import { gql } from "graphql-request";

const sendMessage = gql`
  mutation sendMessage($input: SendMessageInput!) {
    sendMessage(input: $input) {
      message {
        id
      }
      sendMessageUserErrors {
        field
        message
      }
    }
  }
`;

export default {
  mutations: {
    sendMessage,
  },
};
