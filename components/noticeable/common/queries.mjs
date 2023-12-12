export const getProjectsQuery = ({
  after,
  pageSize,
} = {}) => `query {
    organization {
      data: projects(first:${pageSize} after:${after
  ? "\"" + after + "\""
  : null}) {
        pageInfo {
          endCursor
        }
        edges {
          node {
            id
            name
          }
        }
      }
    }
  }`;

export const getEmailSubscriptionsQuery = ({
  projectId,
  isArchived,
  status,
  after,
  pageSize,
  shortened,
} = {}) => `query {
    project(projectId: "${projectId}") {
      data: emailSubscriptions(first:${pageSize} after:${after
  ? "\"" + after + "\""
  : null} ${typeof isArchived != "undefined"
  ? "isArchived: " + isArchived
  : ""} ${status
  ? "status: " + status
  : ""}) {
        pageInfo {
          endCursor
          startCursor
        }
        edges {
          node {
            email,
            ${!shortened ?
    "createdAt, email, fullName, isArchived, status, updatedAt" :
    ""
}
          }
        }
      }
    }
  }`;

export const getPublicationsQuery = ({
  projectId,
  after,
  pageSize,
} = {}) => `query {
    project(projectId: "${projectId}") {
      data: publications(first:${pageSize} after:${after
  ? "\"" + after + "\""
  : null}) {
        pageInfo {
          endCursor
          startCursor
        }
        edges {
          node {
            author {
              avatar
              email
              fullName
              jobTitle
            }
            content {
              html
              plaintext
            }
            createdAt
            excerpt
            id
            isDraft
            labels {
              backgroundColor
              name
              slug
              textColor
            }
            permalink
            publishedAt
            segments
            slug
            title
            updatedAt
          }
        }
      }
    }
  }`;
