import waitwhile from "../../app/waitwhile.app";
import { defineAction } from "@pipedream/types";

export default defineAction({
  name: "Add Customer Note Entry",
  version: "0.0.1",
  key: "waitwhile-add-customer-note-entry",
  description: "Add a customer note entry",
  props: {
    waitwhile,
    customerId: {
      propDefinition: [
        waitwhile,
        "customerId",
        (c) => ({
          prevContext: c.prevContext,
        }),
      ],
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
    visitId: {
      propDefinition: [
        waitwhile,
        "visitId",
        (c) => ({
          prevContext: c.prevContext,
        }),
      ],
    },
    content: {
      label: "Content",
      type: "string",
      optional: true,
      description: "Optional notes",
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
