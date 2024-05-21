function listCustomerClients(query) {
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

function listUserLists() {
  const fields = [
    "id",
    "name",
  ].map((s) => `user_list.${s}`).join(", ");

  return `SELECT ${fields} FROM user_list`;
}

function listLeadForms() {
  const assetFields = [
    "id",
  ].map(((s) => `asset.${s}`));
  const leadFormFields = [
    "business_name",
    "headline",
  ].join((s) => `lead_form_asset.${s}`);

  return `SELECT ${[
    ...assetFields,
    ...leadFormFields,
  ].join(", ")} FROM asset WHERE asset.type = 'LEAD_FORM'`;
}

export const QUERIES = {
  listCustomerClients,
  listLeadForms,
  listUserLists,
};
