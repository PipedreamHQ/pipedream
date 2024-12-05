import ironclad from "../../ironclad.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "ironclad-create-record",
  name: "Create Record",
  description: "Creates a new record in Ironclad. [See the documentation](/reference/create-a-record)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    ironclad,
    recordData: {
      propDefinition: [
        ironclad,
        "recordData",
      ],
    },
    user: {
      propDefinition: [
        ironclad,
        "user",
      ],
      optional: true,
    },
    tags: {
      propDefinition: [
        ironclad,
        "tags",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.ironclad.createRecord(this.recordData, this.user, this.tags);
    $.export("$summary", `Created record with ID: ${response.id}`);
    return response;
  },
};
