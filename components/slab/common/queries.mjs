export const SEARCH_POSTS_QUERY = `
  query SearchPosts($query: String!, $first: Int, $after: String) {
    search(query: $query, types: [POST], first: $first, after: $after) {
      edges {
        node {
          ... on PostSearchResult {
            title
            highlight
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

export const GET_POSTS_QUERY = `
  query GetPosts($ids: [ID!]!) {
    posts(ids: $ids) {
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
`;

export const CREATE_POST_MUTATION = `
  mutation CreatePost($title: String, $topicId: ID) {
    createPost(title: $title, topicId: $topicId) {
      id
      title
      linkAccess
      archivedAt
      publishedAt
      insertedAt
      updatedAt
      version
      content
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
`;

export const UPDATE_POST_MUTATION = `
  mutation UpdatePost($id: ID!, $linkAccess: PostLinkAccess, $ownerId: ID, $archived: Boolean, $published: Boolean, $bannerUrl: String) {
    updatePost(id: $id, linkAccess: $linkAccess, ownerId: $ownerId, archived: $archived, published: $published, bannerUrl: $bannerUrl) {
      id
      title
      linkAccess
      archivedAt
      publishedAt
      insertedAt
      updatedAt
      version
      content
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
`;

export const UPDATE_POST_CONTENT_MUTATION = `
  mutation UpdatePostContent($id: ID!, $delta: Json!) {
    updatePostContent(id: $id, delta: $delta) {
      id
      title
      content
      updatedAt
      version
    }
  }
`;

export const ADD_TOPIC_TO_POST_MUTATION = `
  mutation AddTopicToPost($postId: ID!, $topicId: ID!) {
    addTopicToPost(postId: $postId, topicId: $topicId) {
      id
      name
    }
  }
`;

export const REMOVE_TOPIC_FROM_POST_MUTATION = `
  mutation RemoveTopicFromPost($postId: ID!, $topicId: ID!) {
    removeTopicFromPost(postId: $postId, topicId: $topicId) {
      id
      name
    }
  }
`;

export const LIST_TOPICS_QUERY = `
  query ListTopics {
    organization {
      topics {
        id
        name
      }
    }
  }
`;
