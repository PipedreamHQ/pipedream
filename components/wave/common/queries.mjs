export const LIST_BUSINESS_QUERY = `
  query FetchBusinesses($page: Int!, $pageSize: Int!) {
    businesses(page: $page, pageSize: $pageSize) {
      pageInfo {
        currentPage
        totalPages
        totalCount
      }
      edges {
        node {
          id
          name
          isClassicAccounting
          isPersonal
        }
      }
    }
  }
`;
