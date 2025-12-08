export const SEARCH_POSTS_QUERY = `
  query SearchPosts($query: String!, $first: Int, $after: String, $last: Int, $before: String) {
    search(query: $query, types: [POST], first: $first, after: $after, last: $last, before: $before) {
      edges {
        node {
          ... on PostSearchResult {
            title
            highlight
            content
            post {
              id
              title
              linkAccess
              archivedAt
              publishedAt
              insertedAt
              updatedAt
              version
              content
              banner {
                original
                thumb
                preset
              }
              owner {
                id
                name
                email
              }
              topics {
                id
                name
              }
            }
          }
        }
        cursor
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;

export const LIST_POSTS_QUERY = `
  query ListPosts($query: String!, $first: Int, $after: String, $last: Int, $before: String) {
    search(query: $query, types: [POST], first: $first, after: $after, last: $last, before: $before) {
      edges {
        node {
          ... on PostSearchResult {
            title
            highlight
            content
            post {
              id
              title
              linkAccess
              archivedAt
              publishedAt
              insertedAt
              updatedAt
              version
              content
              banner {
                original
                thumb
                preset
              }
              owner {
                id
                name
                email
              }
              topics {
                id
                name
              }
            }
          }
        }
        cursor
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;

