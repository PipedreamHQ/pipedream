export default {
  // Query Orders endpoint: limit Default 20, Min 0, Max 500.
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 500,
  // Order Search endpoint: limit Default 10, Min 0, Max 100.
  SEARCH_DEFAULT_LIMIT: 10,
  SEARCH_MAX_LIMIT: 100,
  // Project update action that toggles the Order Search feature.
  CHANGE_ORDER_SEARCH_STATUS_ACTION: "changeOrderSearchStatus",
  // OrderSearchStatus enum values.
  ORDER_SEARCH_STATUSES: [
    "Activated",
    "Deactivated",
  ],
  // Mutation that triggers a (re)build of the Order Search index.
  REINDEX_ORDERS_MUTATION: "mutation { reIndexAllOrders { indexingJobId existingIndexingJobId } }",
};
