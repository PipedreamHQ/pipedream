import waitwhile from "../../app/waitwhile.app";
import { defineAction } from "@pipedream/types";

export default defineAction({
  name: "Import Customers",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "waitwhile-import-customers",
  description: "Import customers. [See the doc here](https://developers.waitwhile.com/reference/postcustomersimport)",
  props: {
    waitwhile,
    type: {
      label: "Type",
      type: "string",
      description: "Type",
    },
    locationId: {
      propDefinition: [
        waitwhile,
        "locationId",
      ],
    },
  },
  type: "action",
  methods: {},
  async run({ $ }) {
    const params = {
      type: this.type,
      locationId: this.locationId,
    };
    try {
      const data = await this.waitwhile.importCustomers(params);
      $.export("summary", "Successfully imported customers");
      return data;
    } catch (error) {
      const statusCode = error[Object.getOwnPropertySymbols(error)[1]].status;
      const statusText = error[Object.getOwnPropertySymbols(error)[1]].statusText;
      throw new Error(`Error status code: ${statusCode}. Error status response: ${statusText}`);
    }
  },
});
