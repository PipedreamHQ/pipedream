import waitwhile from "../../app/waitwhile.app";
import { defineAction } from "@pipedream/types";

export default defineAction({
  name: "Update Customer Note Entry",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "waitwhile-update-customer-note-entry",
  description: "Update a customer note entry. [See the doc here](https://developers.waitwhile.com/reference/postcustomerscustomeridnotesnoteid)",
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
      noteId: this.noteId,
    };

    try {
      const data = await this.waitwhile.updateCustomerNoteEntry(params);
      $.export("summary", "Successfully updated customer note entry");
      return data;
    } catch (error) {
      const statusCode = error[Object.getOwnPropertySymbols(error)[1]].status;
      const statusText = error[Object.getOwnPropertySymbols(error)[1]].statusText;
      throw new Error(`Error status code: ${statusCode}. Error status response: ${statusText}. You might need a Waitwhile Paid Plan to use this action`);
    }
  },
});
