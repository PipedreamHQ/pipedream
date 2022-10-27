import waitwhile from "../../app/waitwhile.app";
import { defineAction } from "@pipedream/types";

export default defineAction({
  name: "Add Customer Note Entry",
  version: "0.0.1",
  key: "waitwhile-add-customer-note-entry",
  description: "Add a customer note entry. [See the doc here](https://developers.waitwhile.com/reference/postcustomerscustomeridnotes)",
  props: {
    waitwhile,
    customerId: {
      propDefinition: [
        waitwhile,
        "customerId",
      ],
    },
    locationId: {
      propDefinition: [
        waitwhile,
        "locationId",
      ],
    },
    visitId: {
      propDefinition: [
        waitwhile,
        "visitId",
      ],
    },
    content: {
      propDefinition: [
        waitwhile,
        "content",
      ],
    },

  },
  type: "action",
  methods: {},
  async run({ $ }) {
    const params = {
      customerId: this.customerId,
    };

    const options = {
      content: this.content,
      locationId: this.locationId,
      visitId: this.visitId,
    };

    const data = await this.waitwhile.addCustomerNoteEntry(options, params);
    $.export("summary", "Successfully added a customer note entry");
    return data;
  },
});
