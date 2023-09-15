import { createReadStream } from "fs";
import FormData from "form-data";
import { ConfigurationError } from "@pipedream/platform";
import retry from "async-retry";
import constants from "./constants.mjs";

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

function parse(value) {
  const valueToParse = emptyStrToUndefined(value);
  if (typeof(valueToParse) === "object" || valueToParse === undefined) {
    return valueToParse;
  }
  try {
    return JSON.parse(valueToParse);
  } catch (e) {
    throw new ConfigurationError("Make sure the custom expression contains a valid object");
  }
}

function mapOrParse(value, mapper = (item) => item) {
  try {
    if (!value) {
      return [];
    }
    return Array.isArray(value) && value.map(mapper) || JSON.parse(value);

  } catch (e) {
    throw new ConfigurationError("Make sure the custom expression contains a valid array object");
  }
}

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

async function streamIterator(stream) {
  const resources = [];
  for await (const resource of stream) {
    resources.push(resource);
  }
  return resources;
}

function summaryEnd(count, singular, plural) {
  if (!plural) {
    plural = singular + "s";
  }
  const noun = count === 1 && singular || plural;
  return `${count} ${noun}`;
}

function emptyObjectToUndefined(value) {
  if (typeof(value) !== "object" || Array.isArray(value)) {
    return value;
  }

  if (!Object.keys(value).length) {
    return undefined;
  }

  const reduction = Object.entries(value)
    .reduce((reduction, [
      key,
      value,
    ]) => {
      if (!emptyStrToUndefined(value)) {
        return reduction;
      }
      return {
        ...reduction,
        [key]: value,
      };
    }, {});

  return Object.keys(reduction).length
    ? reduction
    : undefined;
}

function buildFormData(formData, data, parentKey) {
  if (data && typeof(data) === "object") {
    Object.keys(data)
      .forEach(async (key) => {
        buildFormData(formData, data[key], parentKey && `${parentKey}[${key}]` || key);
      });

  } else if (data && constants.FILE_PROP_NAMES.some((prop) => prop.includes(parentKey))) {
    formData.append(parentKey, createReadStream(data));

  } else if (data) {
    formData.append(parentKey, (data).toString());
  }
}

function getFormData(data) {
  try {
    const formData = new FormData();
    buildFormData(formData, data);
    return formData;
  } catch (error) {
    console.log("FormData Error", error);
    throw error;
  }
}

function hasMultipartHeader(headers) {
  return headers
    && headers[constants.CONTENT_TYPE_KEY_HEADER]?.
      includes(constants.MULTIPART_FORM_DATA_VALUE_HEADER);
}

function isRetriable(statusCode) {
  return [
    500,
  ].includes(statusCode);
}

async function withRetries(apiCall) {
  return retry(async (bail) => {
    try {
      return await apiCall();
    } catch (err) {
      const statusCode = err?.response?.status;
      if (!isRetriable(statusCode)) {
        return bail(err);
      }
      console.log(`Retrying with temporary error: ${err.message}`);
      throw err;
    }
  }, {
    retries: 3,
  });
}

function getUniqueEvents(
  events, mapper = (event) => [
    event.resource.id,
    event,
  ],
) {
  return [
    ...new Map(events.map(mapper)).values(),
  ];
}

function buildPropDefinitions({
  app = {}, props = {},
}) {
  return Object.entries(props)
    .reduce((newProps, [
      key,
      prop,
    ]) => {
      if (!prop.propDefinition) {
        return {
          ...newProps,
          [key]: prop,
        };
      }

      const [
        , ...propDefinitionItems
      ] = prop.propDefinition;

      return {
        ...newProps,
        [key]: {
          ...prop,
          propDefinition: [
            app,
            ...propDefinitionItems,
          ],
        },
      };
    }, {});
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

function getCustomFieldsProperties(customFields) {
  if (!customFields) {
    return [];
  }

  try {
    if (typeof(customFields) === "string") {
      customFields = JSON.parse(customFields);
    }

    const customFieldsArray =
      Array.isArray(customFields)
        ? customFields.map((customField) =>
          typeof(customField) === "string"
            ? JSON.parse(customField)
            : customField)
        : [
          customFields,
        ];

    return customFieldsArray.map(({
      name, value = "",
    }, idx) => {
      if (!name) {
        throw `No "name" property specified in row ${idx + 1}`;
      }
      return {
        type: "CUSTOM",
        name,
        value,
      };
    });
  } catch (error) {
    throw new ConfigurationError(`Custom Field row not set with the right JSON structure: ${error}`);
  }
}

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

function strToFloat(str) {
  const floatNum = parseFloat(str);

  if (isNaN(floatNum)) {
    throw new ConfigurationError(`The value "${str}" is not a valid number`);
  }

  return floatNum;
}

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

function addEllipsis(text, maxLength = 20) {
  return text.length < maxLength
    ? text
    : text.substring(0, maxLength - 3) + "...";
}

function splitString(str, nthChar = 8) {
  const regex = new RegExp(`.{1,${nthChar}}`, "g");
  return str.match(regex);
}

function getParamFromUrl(url, key = "cursor") {
  if (!url) {
    return null;
  }
  const parsedUrl = new URL(url);
  return parsedUrl.searchParams.get(key);
}

/*
function buildPropDefinitions({
  app = {}, props = {},
}) {
  return Object.entries(props)
    .reduce((newProps, [
      key,
      prop,
    ]) => {
      if (!prop.propDefinition) {
        return {
          ...newProps,
          [key]: prop,
        };
      }

      const [
        , ...propDefinitionItems
      ] = prop.propDefinition;

      return {
        ...newProps,
        [key]: {
          ...prop,
          propDefinition: [
            app,
            ...propDefinitionItems,
          ],
        },
      };
    }, {});
}

function getPropsOnly({
  component, omitProps = [], appLabel, addedProps = {},
} = {}) {
  const {
    // eslint-disable-next-line no-unused-vars
    [appLabel]: appProp,
    ...props
  } = component.props;
  const builtProps = Object.entries(props)
    .reduce((reduction, [
      key,
      value,
    ]) => {
      if (omitProps.includes(key)) {
        return reduction;
      }
      return {
        ...reduction,
        [key]: value,
      };
    }, {});
  return {
    ...builtProps,
    ...addedProps,
  };
}

function buildAppProps({
  component, omitProps = [], appLabel = "slack", addedProps,
} = {}) {
  return {
    [appLabel]: app,
    ...buildPropDefinitions({
      app,
      props: getPropsOnly({
        component,
        omitProps,
        appLabel,
        addedProps,
      }),
    }),
  };
}
*/

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
    });

    return {
      ...acc,
      ...getPropDefinitions({
        prefix: metaPrefix,
        label: metaLabel,
      }),
    };
  }, {});
}

function toSnakeCase(str) {
  return str?.replace(/([A-Z])/g, "_$1").toLowerCase();
}

function keysToSnakeCase(data = {}) {
  return Object.entries(data)
    .reduce((acc, [
      key,
      value,
    ]) => ({
      ...acc,
      [toSnakeCase(key)]: value,
    }), {});
}

function sortArrayByDate(array, dateField = "") {
  const isDescending = dateField.startsWith("-");
  const field = dateField.replace(/^-/, "");
  return Array.from(array)
    .sort((a, b) => {
      const aDate = new Date(a[field]);
      const bDate = new Date(b[field]);
      return isDescending
        ? bDate - aDate
        : aDate - bDate;
    });
}

function dataToCommaSeparatedList(data = {}) {
  return Object.entries(data)
    .reduce((acc, [
      key,
      value,
    ]) => ({
      ...acc,
      [key]: Array.isArray(value)
        ? value.join(",")
        : value,
    }), {});
}

export default {
  reduceProperties,
  emptyStrToUndefined,
  emptyObjectToUndefined,
  commaSeparatedListToArray,
  parse,
  mapOrParse,
  streamIterator,
  summaryEnd,
  buildFormData,
  getFormData,
  withRetries,
  hasMultipartHeader,
  getUniqueEvents,
  buildPropDefinitions,
  getDataFromStream,
  getCustomFieldsProperties,
  parseArray,
  parseLinkHeader,
  strToFloat,
  parseFields,
  addEllipsis,
  splitString,
  getParamFromUrl,
  getFieldsProps,
  getAdditionalProps,
  keysToSnakeCase,
  sortArrayByDate,
  dataToCommaSeparatedList,
};
