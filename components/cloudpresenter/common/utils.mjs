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

async function getCustomFieldProps(ctx) {
  const props = {};
  if (!ctx.customFieldIds?.length) {
    return props;
  }
  const { data } = await ctx.cloudpresenter.listCustomFields();
  const customFieldLabels = {};
  for (const field of data) {
    customFieldLabels[field.id] = field.name;
  }
  for (const id of ctx.customFieldIds) { console.log(id);
    const fieldLabel = customFieldLabels[`${id}`]; console.log(fieldLabel);
    props[`customField-${id}`] = {
      type: "string",
      label: `Value of ${fieldLabel}`,
    };
  }
  return props;
}

function parseCustomFields(ctx) {
  const customFields = [];
  if (!ctx.customFieldIds?.length) {
    return customFields;
  }
  for (const id of ctx.customFieldIds) {
    customFields.push({
      id,
      value: ctx[`customField-${id}`],
    });
  }
  return customFields;
}

export {
  getPaginatedResources,
  getCustomFieldProps,
  parseCustomFields,
};
