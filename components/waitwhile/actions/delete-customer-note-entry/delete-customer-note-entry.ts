import waitwhile from "../../app/waitwhile.app";
import { defineAction } from "@pipedream/types";

export default defineAction({
  name: "Delete Customer Note Entry",
  version: "0.0.1",
  key: "waitwhile-delete-customer-note-entry",
  description: "Delete a customer note entry",
  props: {
    waitwhile,
    customerId: {
      propDefinition: [
        waitwhile,
        "customerId",
      ],
    },
    noteId: {
      propDefinition: [
        waitwhile,
        "customerNoteId",
        (c) => ({
          customerId: c.customerId,
        }),
      ],
    },

  },
  type: "action",
  methods: {},
  async run({ $ }) {
    const params = {
      customerId: this.customerId,
      noteId: this.noteId,
    };

    const data = await this.waitwhile.deleteCustomerNoteEntry(params);
    $.export("summary", "Successfully deleted customer note entry");
    return data;
  },
});
