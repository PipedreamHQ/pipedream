import waitwhile from "../../app/waitwhile.app";
import { defineAction } from "@pipedream/types";

export default defineAction({
  name: "Get Customer Note Id",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  key: "waitwhile-get-customer-note-id",
  description: "Get customer note by ID. [See the doc here](https://developers.waitwhile.com/reference/getcustomerscustomeridnotescustomernoteid)",
  props: {
    waitwhile,
    customerId: {
      propDefinition: [
        waitwhile,
        "customerId",
      ],
    },
    customerNoteId: {
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
      customerNoteId: this.customerNoteId,
    };

    const data = await this.waitwhile.getCustomerNoteById(params);
    $.export("summary", "Successfully retrieved customer note");
    return data;
  },
});
