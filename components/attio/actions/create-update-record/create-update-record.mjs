import attio from "../../attio.app.mjs";

export default {
  key: "attio-create-update-record",
  name: "Create or Update Record",
  description: "Creates or updates a specific record such as a person or a deal. If the record already exists, it's updated. Otherwise, a new record is created. [See the documentation](https://developers.attio.com/reference/put_v2-objects-object-records)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    attio,
    objectId: {
      propDefinition: [
        attio,
        "objectId",
      ],
    },
    parentRecordId: {
      propDefinition: [
        attio,
        "recordId",
        (c) => ({
          objectId: c.objectId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.upsertRecord({
      $,
      data: {},
    });
    return response;
  },
};
