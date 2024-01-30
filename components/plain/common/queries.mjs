const getCustomers = `
  query getCustomers($cursor: String) {
    customers(
      after: $cursor
      first: 50
    ) {
      edges {
        node {
          id
          fullName
          email {
            email
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

const getUsers = `
  query getUsers($cursor: String) {
    users(
      after: $cursor
      first: 50
    ) {
      edges {
        node {
          id
          fullName
          email
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

const customerGroups = `
  query customerGroups($cursor: String) {
    customerGroups(
      after: $cursor
      first: 50
    ) {
      edges {
        node {
          id
          name
          key
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

const labelTypes = `
  query labelTypes($cursor: String) {
    labelTypes(
      after: $cursor
      first: 50
    ) {
      edges {
        node {
          id
          name
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export default {
  getCustomers,
  getUsers,
  customerGroups,
  labelTypes,
};
