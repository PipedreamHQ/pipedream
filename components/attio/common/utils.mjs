async function streamIterator(stream) {
  let resources = [];
  for await (const resource of stream) {
    resources.push(resource);
  }
  return resources;
}

async function *paginate({
  fn,
  args,
  max,
}) {
  args = {
    ...args,
    params: {
      ...args.params ?? {},
      limit: 500,
      offset: 0,
    },
  };
  let total, count = 0;
  do {
    const { data } = await fn(args);
    for (const item of data) {
      yield item;
      if (max && ++count >= max) {
        return;
      }
    }
    total = data?.length;
    args.params.offset += args.params.limit;
  } while (total === args.params.limit);
}

function parseValues(attributes, values) {
  for (const [
    key,
    value,
  ] of Object.entries(values)) {
    const {
      type, is_multiselect: isMultiselect,
    } = attributes.find(({ id }) => id.attribute_id === key);
    if (type === "checkbox") {
      values[key] = isMultiselect
        ? value.map((v) => !(v === "false" || v === "0"))
        : !(value === "false" || value === "0");
    }
    if (type === "number" || type === "rating") {
      values[key] = isMultiselect
        ? value.map((v) => +v)
        : +value;
    }
  }
  return values;
}

export default {
  streamIterator,
  paginate,
  parseValues,
};
