import app from "../../app/apitemplate_io.app";
import { defineAction } from "@pipedream/types";

export default defineAction({
  name: "Delete an Object",
  description: "Delete a PDF or an image from CDN and mark the transaction as deleted. [See the docs](https://apitemplate.io/apiv2/#tag/API-Integration/operation/delete-object) for more information",
  key: "apitemplate_io-delete-object",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    apiEndpoints: {
      propDefinition: [
        app,
        "apiEndpoints",
      ],
    },
    transactionRef: {
      propDefinition: [
        app,
        "transactionRef",
      ],
    },
  },
  async run({ $ }) {
    const params = {
      transaction_ref: this.transactionRef,
    };

    const response = await this.app.deleteObject($, this.apiEndpoints, params);
    $.export("$summary", `Successfully deleted object ${response.transaction_ref}`);
    return response;
  },
});
