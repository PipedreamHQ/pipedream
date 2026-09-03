import attio from "../../attio.app.mjs";

export default {
  key: "attio-get-record",
  name: "Get Record",
  description: "Retrieve a single record by its ID from a given object (people, companies, deals, or a custom object). Use when you have a record's id and need its attribute values. Example: Object `people`, Record ID `891dcbfc-9141-415d-9b2a-2238a6cc012d`. Returns the record with its attribute values. [See the documentation](https://docs.attio.com/rest-api/endpoint-reference/records/get-a-record)",
  version: "0.0.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  ai: "optimized",
  props: {
    attio,
    objectId: {
      propDefinition: [
        attio,
        "objectId",
      ],
    },
    recordId: {
      description: "The identifier of the record to retrieve. Use the **List Records** action to look up record IDs.",
      propDefinition: [
        attio,
        "recordId",
        (c) => ({
          targetObject: c.objectId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.attio.getRecord({
      $,
      objectId: this.objectId,
      recordId: this.recordId,
    });
    $.export("$summary", "Successfully retrieved the record with ID: " + this.recordId);
    return response;
  },
};
