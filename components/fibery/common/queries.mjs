export const QUERY_ALL = "{ __type(name: \"Query\") { name description fields { name } } } ";
export const MUTATION_ALL = "{ __type(name:\"Mutation\") { fields { name args { name } } } } ";

export function findQuery(
  listingType,
  fields = [
    "id",
    "name",
  ],
) {
  return `query { ${listingType} { ${fields?.join(" ")} } }`;
}

export function createMutation(entityType, attributes) {
  return `mutation { ${entityType} { create${mapAttributes(attributes)} { message } } }`;
}

function mapAttributes(attributes) {
  if (!attributes || Object.keys(attributes).length === 0) return "";
  const mappedAttributes = [];
  for (const [
    k,
    v,
  ] of Object.entries(attributes)) {
    if (typeof v === "string") {
      mappedAttributes.push(`${k}:"${v}"`);
    } else {
      mappedAttributes.push(`${k}:${v}`);
    }
  }
  return `( ${mappedAttributes.join(" ")} )`;
}

export default {
  QUERY_ALL,
  MUTATION_ALL,
};
