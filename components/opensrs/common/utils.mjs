import { XMLBuilder } from "fast-xml-parser";
import constants from "./constants.mjs";

const builder = new XMLBuilder({
  ignoreAttributes: false,
  suppressBooleanAttributes: false,
  arrayNodeName: "item",
  textNodeName: "value",
});

function toPascalCase(str) {
  return str.replace(/(\w)(\w*)/g, (_, group1, group2) =>
    group1.toUpperCase() + group2.toLowerCase());
}

function toUpperCase(str) {
  return str.toUpperCase();
}

function getMetadataProp({
  index, fieldName, prefix, label, labelTransform,
} = {}) {
  const fieldIdx = index + 1;
  const key = `${fieldName}${fieldIdx}`;
  return {
    prefix: prefix
      ? `${prefix}${key}${constants.SEP}`
      : `${key}${constants.SEP}`,
    label: label
      ? `${label} - ${labelTransform(fieldName)} ${fieldIdx}`
      : `${labelTransform(fieldName)} ${fieldIdx}`,
  };
}

function getFieldProps({
  index, fieldName, prefix, labelTransform = toUpperCase,
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
    labelTransform,
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
  numberOfFields, fieldName, prefix, label, labelTransform = toUpperCase,
  getPropDefinitions = ({
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
  }).reduce((acc, _, index) => {
    const {
      prefix: metaPrefix,
      label: metaLabel,
    } = getMetadataProp({
      index,
      fieldName,
      prefix,
      label,
      labelTransform,
    });

    return Object.assign({}, acc, getPropDefinitions({
      prefix: metaPrefix,
      label: metaLabel,
    }));
  }, {});
}

function getXml(body) {
  return {
    "?xml": {
      "@_version": "1.0",
      "@_encoding": "UTF-8",
      "@_standalone": "no",
    },
    "OPS_envelope": {
      header: {
        version: "0.9",
      },
      body,
    },
  };
}

function addItem(key, value) {
  return value
    ? [
      {
        "@_key": key,
        value,
      },
    ]
    : [];
}

function addItemList(key, array) {
  return array?.length
    ? [
      {
        "@_key": key,
        "dt_array": {
          item: array.map((value, index) => ({
            "@_key": index.toString(),
            "dt_assoc": {
              item: [
                ...addItem("name", value),
                ...addItem("sortorder", index + 1),
              ],
            },
          })),
        },
      },
    ]
    : [];
}

function addDnsRecord(key, records) {
  return records.length
    ? [
      {
        "@_key": key,
        "dt_array": {
          item: records.map((record, index) => ({
            "@_key": index.toString(),
            ...record,
          })),
        },
      },
    ]
    : [];
}

function buildXmlData(data) {
  return builder.build(getXml(data));
}

export default {
  buildXmlData,
  addItem,
  addItemList,
  addDnsRecord,
  getAdditionalProps,
  getFieldsProps,
  toUpperCase,
  toPascalCase,
};
