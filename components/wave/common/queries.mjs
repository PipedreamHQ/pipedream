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

export const LIST_CUSTOMERS_BY_BUSINESS_QUERY = `
  query GetBusinessAndCustomers($businessId: ID!, $page: Int!, $pageSize: Int!, $sort: [CustomerSort!]) {
    business(id: $businessId) {
      id
      customers(page: $page, pageSize: $pageSize, sort: $sort) {
        pageInfo {
          currentPage
          totalPages
          totalCount
        }
        edges {
          node {
            id
            name
            email
          }
        }
      }
    }
  }
`;

export const LIST_PRODUCTS_BY_BUSINESS_QUERY = `
  query ($businessId: ID!, $page: Int!, $pageSize: Int!) {
    business(id: $businessId) {
      id
      products(page: $page, pageSize: $pageSize) {
        pageInfo {
          currentPage
          totalPages
          totalCount
        }
        edges {
          node {
            id
            name
            description
            unitPrice
            defaultSalesTaxes {
              id
              name
              abbreviation
              rate
            }
            isSold
            isBought
            isArchived
            createdAt
            modifiedAt
          }
        }
      }
    }
  }
`;
