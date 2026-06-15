const QUOTE_FIELDS = `
  id
  title
  amounts {
    total
  }
  client {
    id
    name
  }
  clientHubUri
  clientHubViewedAt
  contractDisclaimer
  createdAt
  depositAmountUnallocated
  jobberWebUri
  jobs {
    nodes {
      id
      title
    }
  }
  lineItems {
    nodes {
      id
      category
      name
      quantity
      totalPrice
    }
  }
  message
  quoteNumber
  quoteStatus
  salesperson {
    id
  }
  transitionedAt
  updatedAt
`;

const CLIENT_FIELDS = `
  id
  name
  firstName
  lastName
  companyName
  isCompany
  isArchived
  isLead
  title
  balance
  jobberWebUri
  createdAt
  updatedAt
  emails {
    id
    description
    primary
    address
  }
  phones {
    id
    description
    primary
    number
  }
  billingAddress {
    street
    city
    province
    postalCode
    country
  }
  tags {
    nodes {
      label
    }
  }
`;

export default {
  QUOTE_FIELDS,
  CLIENT_FIELDS,
};
