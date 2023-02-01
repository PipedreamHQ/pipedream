const BASE1 = [
  "name",
  "isDeleted",
  "created",
];

const BASE2 = [
  "picture",
  "starred",
  "source",
  "industry",
  ...BASE1,
  "updated",
  "emails",
  "urls",
  "phones",
  "addresses",
  "customFields",
];

const COMPANY = [
  ...BASE2,
  "customerStatus",
  "prospectStatus",
];
const LEAD = [
  ...BASE2,
  "owner",
  "status",
  "score",
  "company",
];
const PERSON = [
  ...COMPANY,
  "owner",
  "converted",
  "company",
];
const PRODUCT = [
  "sku",
  "description",
  "category",
  "cost",
  "prices",
  "isActive",
  ...BASE1,
];

export default {
  COMPANY,
  LEAD,
  PERSON,
  PRODUCT,
};
