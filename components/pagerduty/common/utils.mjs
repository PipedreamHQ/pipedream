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

function reduceProperties({
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
}

function emptyStrToUndefined(value) {
  const trimmed = typeof(value) === "string" && value.trim();
  return trimmed === ""
    ? undefined
    : value;
}

function commaSeparatedListToArray(items) {
  return Array.isArray(items)
    ? items
    : emptyStrToUndefined(items)?.split(",")
      .map((item) => item.trim());
}

export default {
  reduceProperties,
  emptyStrToUndefined,
  commaSeparatedListToArray,
};
