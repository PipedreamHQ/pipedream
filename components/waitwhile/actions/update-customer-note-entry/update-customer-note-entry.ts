import waitwhile from "../../app/waitwhile.app";
import { defineAction } from "@pipedream/types";

export default defineAction({
  name: "Update Customer Note Entry",
  version: "0.0.1",
  key: "waithwile-update-customer-note-entry",
  description: "Update a customer note entry",
  props: {
    waitwhile,
    customerId: {
      propDefinition: [
        "customerId",
      ],
    },
    noteId: {
      propDefinition: [
        "noteId",
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

    const data = await this.waitwhile.updateCustomerNoteEntry(params);
    $.export("summary", "Successfully updated customer note entry");
    return data;
  },
});
