import app from "../../pdf_co.app.mjs";
import constants from "../common/constants.mjs";

export default {
  name: "Custom API Call",
  description: "Custom API Call. [See docs here](https://apidocs.pdf.co/)",
  key: "pdf_co-custom-api-call",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    endpoint: {
      type: "string",
      label: "Endpoint",
      description: "The endpoint URL for the desired resource of api.co\n\n**Eg:** `/pdf/classifier` or `/pdf/info`",
    },
    method: {
      type: "string",
      label: "Method",
      description: "Select the method of the request.",
      options: constants.CUSTOM_CALL_METHODS,
    },
    bodyPayload: {
      type: "object",
      label: "Body Payload",
      description: "Data to be send on the request body.",
      optional: true,
    },
    queryParams: {
      type: "object",
      label: "Query Params",
      description: "Data to be send as query parameters",
      optional: true,
    },
  },
  async run({ $ }) {
    const endpoint = this.endpoint.replace("/v1", "");
    const response = await this.app.genericRequest(
      $,
      this.bodyPayload,
      endpoint,
      this.queryParams,
      this.method,
    );
    $.export("$summary", `Successful call to endpoint ${endpoint}`);
    return response;
  },
};
