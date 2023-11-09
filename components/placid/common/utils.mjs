import { ConfigurationError } from "@pipedream/platform";
import constants from "./constants.mjs";

function emptyStrToUndefined(value) {
  const trimmed = typeof(value) === "string" && value.trim();
  return trimmed === ""
    ? undefined
    : value;
}

function parse(value) {
  const valueToParse = emptyStrToUndefined(value);
  if (typeof(valueToParse) === "object" || valueToParse === undefined) {
    return valueToParse;
  }
  try {
    return JSON.parse(valueToParse);
  } catch (e) {
    throw new ConfigurationError(`Make sure the custom expression contains a valid JSON object: \`${valueToParse}\``);
  }
}

function parseLayers(layers) {
  const parsed = parse(layers);

  if (!Object.keys(parsed).length) {
    throw new ConfigurationError(`The field must contain at least one layer element. \`${layers}\``);
  }

  return Object.fromEntries(
    Object.entries(parsed).map(([
      key,
      value,
    ]) => [
      key,
      parse(value),
    ]),
  );
}

function toPascalCase(str) {
  return str.replace(/(\w)(\w*)/g, (_, group1, group2) =>
    group1.toUpperCase() + group2.toLowerCase());
}

function getMetadataProp({
  index, fieldName, prefix, label,
} = {}) {
  const fieldIdx = index + 1;
  const key = `${fieldName}${fieldIdx}`;
  return {
    prefix: prefix
      ? `${prefix}${key}${constants.SEP}`
      : `${key}${constants.SEP}`,
    label: label
      ? `${label} - ${toPascalCase(fieldName)} ${fieldIdx}`
      : `${toPascalCase(fieldName)} ${fieldIdx}`,
  };
}

function getFieldProps({
  index, fieldName, prefix,
  propsMapper = function propsMapper(prefix) {
    const { [`${prefix}name`]: name } = this;
    return {
      name,
    };
  },
} = {}) {
  const { prefix: metaPrefix } = getMetadataProp({
    index,
    fieldName,
    prefix,
  });
  return propsMapper(metaPrefix);
}

function getFieldsProps({
  numberOfFields, fieldName, propsMapper, prefix,
} = {}) {
  return Array.from({
    length: numberOfFields,
  }).map((_, index) => getFieldProps({
    index,
    fieldName,
    prefix,
    propsMapper,
  }));
}

async function getAdditionalProps({
  numberOfFields, fieldName, prefix, label,
  getPropDefinitions = async ({
    prefix, label,
  }) => ({
    [`${prefix}name`]: {
      type: "string",
      label,
      description: "The name of the field.",
      optional: true,
    },
  }),
} = {}) {
  return Array.from({
    length: numberOfFields,
  }).reduce(async (acc, _, index) => {
    const {
      prefix: metaPrefix,
      label: metaLabel,
    } = getMetadataProp({
      index,
      fieldName,
      prefix,
      label,
    });

    return {
      ...await acc,
      ...await getPropDefinitions({
        prefix: metaPrefix,
        label: metaLabel,
      }),
    };
  }, {});
}

export default {
  parseLayers,
  getAdditionalProps,
  getFieldsProps,
};
