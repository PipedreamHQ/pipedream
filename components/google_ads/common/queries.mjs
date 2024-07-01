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

function listConversionActions() {
  const fields = [
    "name",
  ].map((s) => `conversion_action.${s}`).join(", ");

  return `SELECT ${fields} FROM conversion_action`;
}

function listRemarketingActions() {
  const fields = [
    "name",
  ].map((s) => `remarketing_action.${s}`).join(", ");

  return `SELECT ${fields} FROM remarketing_action`;
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

function listCampaigns({
  fields, savedIds,
}) {
  const defaultFields = [
    "id",
    "name",
  ].map((s) => `campaign.${s}`);
  if (typeof fields === "string") {
    fields = fields.split(",").map((s) => s.trim());
  }
  if (!fields?.length) {
    fields = defaultFields;
  } else {
    defaultFields.forEach((f) => {
      if (!fields.includes(f)) {
        fields.push(f);
      }
    });
  }

  const filter = savedIds?.length
    ? ` WHERE ${savedIds.map((id) => `campaign.id != ${id}`).join(" AND ")}`
    : "";

  return `SELECT ${fields.join(", ")} FROM campaign${filter}`;
}

function listResources(resource, query) {
  const name = resource === "customer"
    ? "descriptive_name"
    : "name";
  const fieldResource = resource === "ad_group_ad"
    ? "ad_group_ad.ad"
    : resource;

  let result = `SELECT ${fieldResource}.id, ${fieldResource}.${name} FROM ${resource}`;
  if (query) {
    result += ` WHERE ${fieldResource}.${name} LIKE '%${query}%'`;
  }
  return result;
}

export const QUERIES = {
  listCampaigns,
  listConversionActions,
  listCustomerClients,
  listLeadForms,
  listLeadFormSubmissionData,
  listRemarketingActions,
  listResources,
  listUserLists,
};
