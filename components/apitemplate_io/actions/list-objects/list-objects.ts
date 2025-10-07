import app from "../../app/apitemplate_io.app";
import { defineAction } from "@pipedream/types";

export default defineAction({
  name: "List Generated Objects",
  description: "Retrieves all the generated PDFs and images. [See the docs](https://apitemplate.io/apiv2/#tag/API-Integration/operation/list-objects) for more information",
  key: "apitemplate_io-list-objects",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
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
    templateId: {
      propDefinition: [
        app,
        "templateId",
      ],
      description: "Filtered by template id",
      optional: true,
    },
    transactionType: {
      propDefinition: [
        app,
        "transactionType",
      ],
    },
    limit: {
      propDefinition: [
        app,
        "limit",
      ],
    },
    offset: {
      propDefinition: [
        app,
        "offset",
      ],
    },
  },
  async run({ $ }) {
    const params = {
      template_id: this.templateId,
      transaction_type: this.transactionType,
      limit: this.limit,
      offset: this.offset,
    };

    const response = await this.app.listObjects($, this.apiEndpoints, params);
    $.export("$summary", `Successfully found ${response?.objects?.length} objects`);
    return response;
  },
});
