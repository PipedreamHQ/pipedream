import { ConfigurationError } from "@pipedream/platform";

function getCustomFieldsProperties(customFields) {
  if (!customFields) {
    return [];
  }

  if (!Array.isArray(customFields)) {
    throw new ConfigurationError("Custom Fields property is not an array");
  }

  try {
    return customFields.map(JSON.parse)
      .map(({
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
