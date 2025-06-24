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
  depositRecords {
    nodes {
      id
    }
  }
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
  request {
    id
  }
  salesperson {
    id
  }
  taxDetails {
    totalTaxAmount
  }
  transitionedAt
  updatedAt
`;

export default {
  QUOTE_FIELDS,
};
