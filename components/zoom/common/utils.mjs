async function streamIterator(stream) {
  const resources = [];
  for await (const resource of stream) {
    resources.push(resource);
  }
  return resources;
}

function summaryEnd(count, singular, plural) {
  if (!plural) {
    plural = singular + "s";
  }
  const noun = count === 1 && singular || plural;
  return `${count} ${noun}`;
}

function parseObj(obj) {
  if (!obj) {
    return undefined;
  }

  if (typeof obj === "string") {
    try {
      return JSON.parse(obj);
    } catch {
      return obj;
    }
  }

  if (Array.isArray(obj)) {
    const values = [];
    for (const item of obj) {
      if (typeof item === "string") {
        try {
          values.push(JSON.parse(item));
        } catch {
          values.push(item);
        }
      } else {
        values.push(item);
      }
    }
    return values;
  }

  return obj;
}

export default {
  streamIterator,
  summaryEnd,
  parseObj,
};
