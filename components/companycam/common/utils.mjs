function addProperty({
  src, predicate, addition,
}) {
  return predicate
    ? {
      ...src,
      ...addition,
    }
    : src;
}

function reduceProperties({
  initialProps = {}, additionalProps = {},
}) {
  return Object.entries(additionalProps)
    .reduce((src, [
      key,
      context,
    ]) => {
      const isArrayContext = Array.isArray(context);
      return addProperty({
        src,
        predicate: isArrayContext
          ? context[1]
          : context,
        addition: {
          [key]: isArrayContext
            ? context[0]
            : context,
        },
      });
    }, initialProps);
}

function strToFloat(str) {
  const floatNum = parseFloat(str);

  if (isNaN(floatNum)) {
    return;
  }

  return floatNum;
}

export default {
  reduceProperties,
  strToFloat,
};
