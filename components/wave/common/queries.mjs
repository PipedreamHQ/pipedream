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
            firstName
            lastName
            email
            createdAt
            address {
              addressLine1
              addressLine2
              city
              province {
                code
                name
              }
              country {
                code
                name
              }
              postalCode
            }
            currency {
              code
            }
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

export const LIST_INVOICES_BY_BUSINESS_QUERY = `
  query($businessId: ID!, $page: Int!, $pageSize: Int!) {
    business(id: $businessId) {
      id
      invoices(page: $page, pageSize: $pageSize) {
        pageInfo {
          currentPage
          totalPages
          totalCount
        }
        edges {
          node {
            id
            createdAt
            modifiedAt
            pdfUrl
            viewUrl
            status
            title
            subhead
            invoiceNumber
            invoiceDate
            poNumber
            customer {
              id
              name
              # Can add additional customer fields here
            }
            currency {
              code
            }
            dueDate
            amountDue {
              value
              currency {
                symbol
              }
            }
            amountPaid {
              value
              currency {
                symbol
              }
            }
            taxTotal {
              value
              currency {
                symbol
              }
            }
            total {
              value
              currency {
                symbol
              }
            }
            exchangeRate
            footer
            memo
            disableCreditCardPayments
            disableBankPayments
            itemTitle
            unitTitle
            priceTitle
            amountTitle
            hideName
            hideDescription
            hideUnit
            hidePrice
            hideAmount
            items {
              product {
                id
                name
                # Can add additional product fields here
              }
              description
              quantity
              price
              subtotal {
                value
                currency {
                  symbol
                }
              }
              total {
                value
                currency {
                  symbol
                }
              }
              account {
                id
                name
                subtype {
                  name
                  value
                }
                # Can add additional account fields here
              }
              taxes {
                amount {
                  value
                }
                salesTax {
                  id
                  name
                  # Can add additional sales tax fields here
                }
              }
            }
            lastSentAt
            lastSentVia
            lastViewedAt
          }
        }
      }
    }
  }
`;
