import salesforce from "../../salesforce_rest_api.app.mjs";

export default {
  key: "salesforce_rest_api-find-records",
  name: "Find Records",
  description:
    "Retrieves selected fields for some or all records of a selected object. [See the documentation](https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/dome_get_field_values.htm)",
  version: "0.2.0",
  type: "action",
  props: {
    salesforce,
    sobjectType: {
      propDefinition: [
        salesforce,
        "objectType",
      ],
      description: "The type of object to obtain records of.",
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
    recordIds: {
      propDefinition: [
        salesforce,
        "recordId",
        (c) => ({
          objType: c.sobjectType,
        }),
      ],
      label: "Record ID(s)",
      type: "string[]",
      optional: true,
      description:
        "The record(s) to retrieve. If not specified, all records will be retrieved.",
    },
  },
  async run({ $ }) {
    let {
      sobjectType,
      recordIds,
      fieldsToObtain,
    } = this;

    if (typeof recordIds === "string") recordIds = recordIds.split(",");
    if (typeof fieldsToObtain === "string") fieldsToObtain = fieldsToObtain.split(",");

    let query = `SELECT ${fieldsToObtain.join(", ")} FROM ${sobjectType}`;

    if (recordIds?.length) {
      query += ` WHERE Id IN ('${recordIds.join("','")}')`;
    }

    const { records } = await this.salesforce.query({
      $,
      query,
    });

    $.export("$summary", `Sucessfully retrieved ${records.length} records`);
    return records;
  },
};
