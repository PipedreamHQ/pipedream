import waitwhile from "../../app/waitwhile.app";
import { defineAction } from "@pipedream/types";

export default defineAction({
  name: "Delete Customer Note Entry",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "waitwhile-delete-customer-note-entry",
  description: "Delete a customer note entry. [See the doc here](https://developers.waitwhile.com/reference/deletecustomerscustomeridnotesnoteid)",
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

    try {
      const data = await this.waitwhile.deleteCustomerNoteEntry(params);
      $.export("summary", "Successfully deleted customer note entry");

      return data;
    } catch (error) {
      const statusCode = error[Object.getOwnPropertySymbols(error)[1]].status;
      const statusText = error[Object.getOwnPropertySymbols(error)[1]].statusText;
      throw new Error(`Error status code: ${statusCode}. Error status response: ${statusText}`);
    }
  },
});
