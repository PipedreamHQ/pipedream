import waitwhile from "../../app/waitwhile.app";
import { defineAction } from "@pipedream/types";

export default defineAction({
  name: "List Customer Note Entries",
  version: "0.0.1",
  key: "waitwhile-list-customer-note-entries",
  description: "List customer note entries",
  props: {
    waitwhile,
    customerId: {
      propDefinition: [
        "customerId",
       
      ],
    },
  },
  type: "action",
  methods: {},
  async run({ $ }) {
    const data = await this.waitwhile.listCustomerNoteEntries(this.customerId);
    $.export("summary", "Successfully retrieved customer note entries");
    return data;
  },
});
