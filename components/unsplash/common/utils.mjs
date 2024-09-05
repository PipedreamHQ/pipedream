function parseLinkHeader(linkHeader) {
  return linkHeader?.split(",")
    .reduce((props, link) => {
      const [
        url,
        rel,
      ] = link.split(";");
      const [
        , value,
      ] = url.split("<");
      const [
        , key,
      ] = rel.split("=");
      const clearKey = key.replace(/"/g, "");
      const clearValue = value.replace(/>/g, "");
      return {
        ...props,
        [clearKey]: clearValue,
      };
    }, {});
}

async function iterate(iterations) {
  const items = [];
  for await (const item of iterations) {
    items.push(item);
  }
  return items;
}

export default {
  iterate,
  parseLinkHeader,
};
