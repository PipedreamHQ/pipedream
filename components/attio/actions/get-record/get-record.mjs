import attio from "../../attio.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "attio-get-record",
  name: "Get Record",
  description: "Retrieves the record with the specified ID. [See the documentation](https://docs.attio.com/rest-api/endpoint-reference/records/get-a-record)",
  version: "0.0.1",
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
      label: "Person ID",
      description: "The identifier of the contact to update.",
      propDefinition: [
        attio,
        "recordId",
        () => ({
          targetObject: constants.TARGET_OBJECT.PEOPLE,
          mapper: ({
            id: { record_id: value },
            values: { name },
          }) => ({
            value,
            label: name[0]?.full_name,
          }),
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
