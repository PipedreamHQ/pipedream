import app from "../../app/apitemplate_io.app";
import { defineAction } from "@pipedream/types";

export default defineAction({
  name: "Create a PDF",
  description: "Create a PDF file with JSON data and your template. [See the docs](https://apitemplate.io/apiv2/#tag/API-Integration/operation/create-pdf) for more information",
  key: "apitemplate_io-create-pdf",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
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
    templateId: {
      propDefinition: [
        app,
        "templateId",
        () => ({
          format: "PDF",
        }),
      ],
    },
    data: {
      propDefinition: [
        app,
        "data",
      ],
    },
    expiration: {
      propDefinition: [
        app,
        "expiration",
      ],
    },
    meta: {
      propDefinition: [
        app,
        "meta",
      ],
    },
    exportType: {
      propDefinition: [
        app,
        "exportType",
      ],
    },
    outputHtml: {
      propDefinition: [
        app,
        "outputHtml",
      ],
    },
    outputFormat: {
      propDefinition: [
        app,
        "outputFormat",
      ],
    },
    filename: {
      propDefinition: [
        app,
        "filename",
      ],
    },
    imageResampleRes: {
      propDefinition: [
        app,
        "imageResampleRes",
      ],
    },
    isCmyk: {
      propDefinition: [
        app,
        "isCmyk",
      ],
    },
    async: {
      propDefinition: [
        app,
        "async",
      ],
    },
    webhookUrl: {
      propDefinition: [
        app,
        "webhookUrl",
      ],
    },
  },
  methods: {
    boolToInt(prop) {
      if (typeof (prop) === "boolean") {
        if (prop) {
          return 1;
        }
        return 0;
      }
      return prop;
    },
  },
  async run({ $ }) {
    const params = {
      template_id: this.templateId,
      expiration: this.expiration,
      meta: this.meta,
      export_type: this.exportType,
      output_html: this.boolToInt(this.outputHtml),
      output_format: this.outputFormat,
      filename: this.filename,
      image_resample_res: this.imageResampleRes,
      is_cmyk: this.boolToInt(this.isCmyk),
      async: this.boolToInt(this.async),
      webhook_url: this.webhookUrl,
    };

    const response = await this.app.createImage($, this.apiEndpoints, params, this.data);
    $.export("$summary", `Successfully created a new PDF: ${response.transaction_ref}`);
    return response;
  },
});
