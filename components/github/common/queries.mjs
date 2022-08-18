const DEFAULT_PAGE_SIZE = 10;

const projectsQuery = `
  query ($repoOwner: String!, $repoName: String!, $cursor: String) {
    repository(owner: $repoOwner, name: $repoName) {
      projectsV2(first: ${DEFAULT_PAGE_SIZE}, after: $cursor) {
        nodes {
          number
          title
        }
        pageInfo {
          endCursor
        }
      }
    }
  }
`;

const statusFieldsQuery = `
  query ($repoOwner: String!, $repoName: String!, $project: Int!) {
    repository(name: $repoName, owner: $repoOwner) {
      projectV2(number: $project) {
        field(name: "Status") {
          ... on ProjectV2SingleSelectField {
            options {
              name
              id
            }
          }
        }
      }
    }
  }
`;

const projectItemQuery = `
  query ($nodeId: ID!) {
    node(id: $nodeId) {
      ... on ProjectV2Item {
        type
        isArchived
        content {
          ... on Issue {
            number
          }
        }
        fieldValueByName(name: "Status") {
          ... on ProjectV2ItemFieldSingleSelectValue {
            name
            optionId
          }
        }
      }
    }
  }
`;

export default {
  projectsQuery,
  statusFieldsQuery,
  projectItemQuery,
};
