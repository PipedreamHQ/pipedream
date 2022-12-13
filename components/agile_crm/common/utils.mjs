import { ConfigurationError } from "@pipedream/platform";

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

export default {
  getCustomFieldsProperties,
};
