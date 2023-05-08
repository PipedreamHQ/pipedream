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

export default {
  parseLinkHeader,
};
