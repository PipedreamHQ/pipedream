async function getPaginatedResources(args) {
  const items = paginate(args);
  const results = [];
  for await (const item of items) {
    results.push(item);
  }
  return results;
}

async function *paginate({
  resourceFn,
  params = {},
  resourceType,
  max,
}) {
  params = {
    ...params,
    page: 1,
  };
  let lastPage = 1;
  let count = 0;
  do {
    const { data } = await resourceFn({
      params,
    });
    const items = data[resourceType].data;
    for (const item of items) {
      yield item;
      count++;
      if (max && count >= max) {
        return;
      }
    }
    lastPage = data[resourceType].last_page;
    params.page++;
  } while (params.page <= lastPage);
}

function parseCustomFields(customFields) {
  const jsonParsedCustomFields = customFields
    ? typeof customFields === "string"
      ? JSON.parse(customFields)
      : customFields
    : {};
  const parsedCustomFields = [];
  for (const [
    key,
    value,
  ] of Object.entries(jsonParsedCustomFields)) {
    parsedCustomFields.push({
      id: key,
      value,
    });
  }
  return parsedCustomFields;
}

export {
  getPaginatedResources,
  parseCustomFields,
};
