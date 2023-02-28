import util from "util";

export const QUERY_ALL = "{ __type(name: \"Query\") { name description fields { name } } } ";
export const MUTATION_ALL = "{ __type(name:\"Mutation\") { fields { name args { name } } } } ";

export function findQuery(
  listingType,
  filter,
  fields = [
    "id",
    "name",
  ],
) {
  filter = mapAttributes({
    attributes: filter,
    quoteString: false,
  });
  return `query { ${listingType} ${filter} { ${fields?.join(" ")} } }`;
}

export function createMutation(entityType, attributes) {
  attributes = mapAttributes({
    attributes,
  });
  return `mutation { ${entityType} { create ${attributes} { message } } }`;
}

export function createBatchMutation(entityType, attributesList) {
  attributesList = util.inspect(attributesList).replace(/'/g, "\"");
  return `mutation { ${entityType} { createBatch ( data: ${attributesList} ) { message } } }`;
}

export function updateMutation(entityType, attributes, ids) {
  ids = ids.map((id) => `"${id}"`).join(",");
  attributes = mapAttributes({
    attributes,
  });
  return `mutation { ${entityType} ( id: { in: [${ids}] } ) { update ${attributes} { message } } }`;
}

export function mapAttributes({
  attributes, quoteString = true, joinString = " ",
}) {
  if (typeof (attributes) === "string") {
    attributes = JSON.parse(attributes);
  }

  if (!attributes || Object.keys(attributes).length === 0) {
    return "";
  }

  const mappedAttributes = [];
  for (const [
    k,
    v,
  ] of Object.entries(attributes)) {
    if (typeof v === "string" && quoteString) {
      mappedAttributes.push(`${k}:"${v}"`);
    } else {
      mappedAttributes.push(`${k}:${v}`);
    }
  }
  return `( ${mappedAttributes.join(joinString)} )`;
}

export default {
  QUERY_ALL,
  MUTATION_ALL,
};
