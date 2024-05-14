export function listCustomerClients(query) {
  const fields = [
    "client_customer",
    "descriptive_name",
    "id",
    "level",
    "manager",
  ]
    .map((s) => `customer_client.${s}`)
    .join(", ");

  const condition = query
    ? `customer_client.descriptive_name LIKE '%${query}%'`
    : "customer_client.level <= 3";
  return `SELECT ${fields} FROM customer_client WHERE ${condition}`;
}

export const QUERIES = {
  listCustomerClients,
};
