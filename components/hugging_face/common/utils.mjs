function isJson(value) {
  value =
    typeof(value) !== "string"
      ? JSON.stringify(value)
      : value;

  try {
    value = JSON.parse(value);
  } catch (e) {
    return false;
  }

  return typeof(value) === "object" && value !== null;
}

function valueToObject(value) {
  if (!isJson(value)) {
    return value;
  }
  return JSON.parse(value);
}

function parseFields(fields) {
  if (!fields) {
    return;
  }
  return Object.entries(fields)
    .reduce((props, [
      key,
      value,
    ]) => ({
      ...props,
      [key]: valueToObject(value),
    }), {});
}

function strToFloat(str) {
  const floatNum = parseFloat(str);

  if (isNaN(floatNum)) {
    return;
  }

  return floatNum;
}

function parseLinkHeader(linkHeader) {
  if (!linkHeader) {
    return;
  }
  return linkHeader.split(",")
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

function getDataFromStream(stream) {
  const buffer = [];
  return new Promise((resolve, reject) => {
    stream.on("data", (chunk) => buffer.push(chunk));
    stream.on("end", () => {
      const data = Buffer.concat(buffer).toString();
      return resolve(JSON.parse(data));
    });
    stream.on("error", (err) => reject(err));
  });
}

export default {
  reduceProperties,
  getDataFromStream,
  strToFloat,
  parseLinkHeader,
  parseFields,
};
