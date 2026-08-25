import attio from "../../attio.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "attio-create-update-record",
  name: "Create or Update Record",
  description: "Creates or updates a specific record such as a person or a deal. If the record already exists, it's updated. Otherwise, a new record is created. [See the documentation](https://developers.attio.com/reference/put_v2-objects-object-records)",
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

    const response = await attio.upsertRecord({
      $,
      objectId,
      params: {
        matching_attribute: matchingAttribute,
      },
      data: {
        data: {
          values: typeof values === "string"
            ? JSON.parse(values)
            : values,
        },
      },
    });
    $.export("$summary", "Successfully created or updated record");
    return response;
  },
};
