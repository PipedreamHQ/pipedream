import attio from "../../attio.app.mjs";

export default {
  key: "attio-get-record",
  name: "Get Record",
  description: "Retrieves the record with the specified ID. [See the documentation](https://docs.attio.com/rest-api/endpoint-reference/records/get-a-record)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    attio,
    objectId: {
      propDefinition: [
        attio,
        "objectId",
      ],
    },
    recordId: {
      description: "The identifier of the record to retrieve.",
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
