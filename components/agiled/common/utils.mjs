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
  getAdditionalProps,
  getFieldsProps,
};
