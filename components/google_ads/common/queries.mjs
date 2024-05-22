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
  ].map((s) => `asset.lead_form_asset.${s}`);

  return `SELECT ${[
    ...assetFields,
    ...leadFormFields,
  ].join(", ")} FROM asset WHERE asset.type = 'LEAD_FORM'`;
}

function listLeadFormSubmissionData(id) {
  const fields = [
    "custom_lead_form_submission_fields",
    "gclid",
    "id",
    "lead_form_submission_fields",
    "submission_date_time",
  ].map((s) => `lead_form_submission_data.${s}`).join(", ");
  return `SELECT ${fields} FROM lead_form_submission_data WHERE asset.id = '${id}'`;
}

export const QUERIES = {
  listCustomerClients,
  listLeadForms,
  listLeadFormSubmissionData,
  listUserLists,
};
