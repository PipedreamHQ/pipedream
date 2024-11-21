import ortto from "../../ortto.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "ortto-create-record",
  name: "Create or Update Record",
  description: "Initializes a new record (person or organization) or updates a preexisting record in the Ortto account. [See the documentation](https://help.ortto.com/a-250-api-reference)",
  version: "0.0.1",
  type: "action",
  props: {
    ortto,
    recordType: {
      propDefinition: [
        ortto,
        "recordType",
      ],
    },
    data: {
      propDefinition: [
        ortto,
        "data",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.ortto.initializeOrUpdateRecord({
      recordType: this.recordType,
      data: this.data,
    });
    $.export("$summary", `Successfully initialized or updated record with type: ${this.recordType}`);
    return response;
  },
};
