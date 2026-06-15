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

const JOB_FIELDS = `
  id
  jobNumber
  title
  instructions
  jobStatus
  jobType
  client {
    id
    name
  }
  property {
    id
    address {
      street
      city
      province
      postalCode
      country
    }
  }
  total
  startAt
  endAt
  createdAt
  updatedAt
  jobberWebUri
`;

const INVOICE_FIELDS = `
  id
  invoiceNumber
  subject
  message
  invoiceStatus
  amounts {
    total
    invoiceBalance
    depositAmount
  }
  client {
    id
    name
  }
  createdAt
  updatedAt
  jobberWebUri
`;

const REQUEST_FIELDS = `
  id
  title
  requestStatus
  client {
    id
    name
  }
  property {
    id
    address {
      street
      city
      province
      postalCode
      country
    }
  }
  createdAt
  updatedAt
  jobberWebUri
`;

const SCHEDULED_ITEM_FIELDS = `
  __typename
  ... on Visit {
    id
    title
    startAt
    endAt
    isComplete
    client {
      id
      name
    }
  }
  ... on Task {
    id
    title
    startAt
    endAt
    isComplete
  }
  ... on Event {
    id
    startAt
    endAt
  }
`;

export default {
  QUOTE_FIELDS,
  JOB_FIELDS,
  INVOICE_FIELDS,
  REQUEST_FIELDS,
  SCHEDULED_ITEM_FIELDS,
};
