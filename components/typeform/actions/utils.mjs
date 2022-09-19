function addProperty({
  src, validation, addition,
}) {
  return validation
    ? {
      ...src,
      ...addition,
    }
    : src;
}

export default {
  reduceProperties({
    initialProps = {}, additionalProps = {},
  }) {
    return Object.keys(additionalProps)
      .reduce((reducer, key) => {
        const [
          value,
          validation,
        ] = additionalProps[key];
        return addProperty({
          src: reducer,
          validation: validation,
          addition: {
            [key]: value,
          },
        });
      }, initialProps);
  },
  commaSeparatedList(items) {
    return Array.isArray(items)
      ? items.join(",")
      : items;
  },
};
