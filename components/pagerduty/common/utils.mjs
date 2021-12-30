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
        const context = additionalProps[key];

        if (!Array.isArray(context)) {
          return addProperty({
            src: reducer,
            validation: context,
            addition: {
              [key]: context,
            },
          });
        }

        const [
          value,
          validation,
        ] = context;

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
  emptyStrToUndefined(value) {
    const trimmed = typeof(value) === "string" && value.trim();
    return trimmed === ""
      ? undefined
      : value;
  },
};
