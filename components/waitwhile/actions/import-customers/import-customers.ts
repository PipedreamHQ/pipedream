import waitwhile from "../../app/waitwhile.app";
import { defineAction } from "@pipedream/types";

export default defineAction({
  name: "Import Customers",
  version: "0.0.1",
  key: "waitwhile-import-customers",
  description: "Import customers",
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
        (c) => ({
          prevContext: c.prevContext,
        }),
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
    const data = await this.waitwhile.importCustomers(params);
    $.export("summary", "Successfully imported customers");
    return data;
  },
});
