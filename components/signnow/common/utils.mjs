import { ConfigurationError } from "@pipedream/platform";
import constants from "./constants.mjs";

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

function getAdditionalProps({
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
  }).reduce(async (reduction, _, index) => {
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
      ...await reduction,
      ...await getPropDefinitions({
        prefix: metaPrefix,
        label: metaLabel,
      }),
    };
  }, {});
}

const parseJson = (input) => {
  const parse = (value) => {
    if (typeof(value) === "string") {
      try {
        return parseJson(JSON.parse(value));
      } catch (e) {
        return value;
      }
    } else if (typeof(value) === "object" && value !== null) {
      return Object.entries(value)
        .reduce((acc, [
          key,
          val,
        ]) => Object.assign(acc, {
          [key]: parse(val),
        }), {});
    }
    return value;
  };

  return parse(input);
};

function parseArray(value) {
  try {
    if (!value) {
      return [];
    }

    if (Array.isArray(value)) {
      return value;
    }

    const parsedValue = JSON.parse(value);

    if (!Array.isArray(parsedValue)) {
      throw new Error("Not an array");
    }

    return parsedValue;

  } catch (e) {
    throw new ConfigurationError("Make sure the custom expression contains a valid array object");
  }
}

export default {
  getFieldProps,
  getFieldsProps,
  getAdditionalProps,
  parseArray: (value) => parseArray(value).map(parseJson),
};
