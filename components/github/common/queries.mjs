const DEFAULT_PAGE_SIZE = 10;

const organizationProjectsQuery = `
  query ($repoOwner: String!, $cursor: String) {
    organization(login: $repoOwner) {
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

const discussionsQuery = `
  query ($repoOwner: String!, $repoName: String!) {
    repository(owner: $repoOwner, name: $repoName) {
      discussions(first: 100) {
        nodes {
          author {
            login
            url
          }
          bodyHTML
          bodyText
          createdAt
          id
          title
          url
        }
      }
    }
  }
`;

const organizationStatusFieldsQuery = `
  query ($repoOwner: String!, $project: Int!) {
    organization(login: $repoOwner) {
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

const projectItemsQuery = `
  query ($repoOwner: String!, $repoName: String!, $project: Int!, $historicalEventsNumber: Int!) {
    repository(name: $repoName, owner: $repoOwner) {
      projectV2(number: $project) {
        items(last: $historicalEventsNumber) {
          nodes {
            id
            type
          }
        }
      }
    }
  }
`;

const organizationProjectItemsQuery = `
  query ($repoOwner: String!, $project: Int!, $historicalEventsNumber: Int!) {
    organization(login: $repoOwner) {
      projectV2(number: $project) {
        items(last: $historicalEventsNumber) {
          nodes {
            id
            type
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
            repository {
              name
            }
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
  discussionsQuery,
  projectsQuery,
  organizationProjectsQuery,
  statusFieldsQuery,
  organizationStatusFieldsQuery,
  projectItemsQuery,
  organizationProjectItemsQuery,
  projectItemQuery,
};
