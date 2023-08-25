import { gql } from "graphql-request";

const listUsers = gql`
  query listUsers {
    users {
      ... on UsersSuccess {
        users {
          id
          name
          isFullUser
          viewerIsFollowing
          picture
          profile {
            id
            username
            private
            bio
            pictureUrl
          }
          sharedArticlesCount
          sharedHighlightsCount
          sharedNotesCount
          friendsCount
          followersCount
        }
      }
      ... on UsersError {
        errorCodes
      }
    }
  }
`;

export default {
  queries: {
    listUsers,
  },
};
