const LIST_CUSTOMER_CLIENTS =
  "SELECT customer_client.level, customer_client.manager, customer_client.descriptive_name, customer_client.status, customer_client.id FROM customer_client WHERE customer_client.level <= 1";

export const QUERIES = {
  LIST_CUSTOMER_CLIENTS,
};
