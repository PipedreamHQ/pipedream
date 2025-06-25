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

export default {
  QUOTE_FIELDS,
};
