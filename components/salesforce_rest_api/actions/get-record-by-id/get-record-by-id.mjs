import salesforce from "../../salesforce_rest_api.app.mjs";

export default {
  key: "salesforce_rest_api-get-record-by-id",
  name: "Get Record by ID",
  description: "Retrieves a record by its ID. [See the documentation](https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/dome_get_field_values.htm)",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    salesforce,
    sobjectType: {
      propDefinition: [
        salesforce,
        "objectType",
      ],
      description: "The type of object to retrieve a record of",
    },
    recordId: {
      propDefinition: [
        salesforce,
        "recordId",
        (c) => ({
          objType: c.sobjectType,
        }),
      ],
      description: "The ID of the record to retrieve",
    },
    fieldsToObtain: {
      propDefinition: [
        salesforce,
        "fieldsToObtain",
        (c) => ({
          objType: c.sobjectType,
        }),
      ],
    },
  },
  async run({ $ }) {
    let {
      sobjectType,
      recordId,
      fieldsToObtain,
    } = this;

    if (typeof fieldsToObtain === "string") fieldsToObtain = fieldsToObtain.split(",");

    let query = `SELECT ${fieldsToObtain.join(", ")} FROM ${sobjectType}`;

    query += ` WHERE Id = '${recordId}'`;

    const { records } = await this.salesforce.query({
      $,
      query,
    });

    $.export("$summary", `Sucessfully retrieved record with ID ${recordId}`);
    return records[0];
  },
};
