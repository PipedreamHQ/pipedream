import { ConfigurationError } from "@pipedream/platform";
import attio from "../../attio.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "attio-create-update-record",
  name: "Create or Update Record",
  description: "Creates or updates a specific record such as a person or a company. If a record with the same matching attribute already exists, it's updated; otherwise a new record is created. Objects without a unique attribute to match on (e.g. deals) are not available here. [See the documentation](https://developers.attio.com/reference/put_v2-objects-object-records)",
  version: "0.1.0",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    attio,
    objectId: {
      propDefinition: [
        attio,
        "objectId",
        () => ({
          filter: (o) => o.api_slug !== constants.TARGET_OBJECT.DEALS,
        }),
      ],
    },
    matchingAttribute: {
      propDefinition: [
        attio,
        "matchingAttribute",
        (c) => ({
          objectId: c.objectId,
        }),
      ],
    },
    values: {
      type: "object",
      label: "Values",
      description: "Attribute slug to value pairs for the record, e.g. `{ \"name\": \"Ada Lovelace\", \"email_addresses\": [\"ada@example.test\"] }`. Include the matching attribute among them. [See the attributes endpoint](https://developers.attio.com/reference/get_v2-target-identifier-attributes) for what a given object accepts.",
    },
  },
  async run({ $ }) {
    const {
      attio,
      objectId,
      matchingAttribute,
      values,
    } = this;

    let parsedValues;
    try {
      parsedValues = typeof values === "string"
        ? JSON.parse(values)
        : values;
    } catch (error) {
      throw new ConfigurationError(`Values is not valid JSON: ${error.message}`);
    }

    if (
      parsedValues === null
      || typeof parsedValues !== "object"
      || Array.isArray(parsedValues)
    ) {
      throw new ConfigurationError(
        "Values must be a JSON object of attribute slug to value pairs (not a list, null, or a single value).",
      );
    }

    const response = await attio.upsertRecord({
      $,
      objectId,
      params: {
        matching_attribute: matchingAttribute,
      },
      data: {
        data: {
          values: parsedValues,
        },
      },
    });
    $.export("$summary", "Successfully created or updated record");
    return response;
  },
};
