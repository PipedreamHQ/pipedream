import commpeak from "../../commpeak.app.mjs";

export default {
  key: "commpeak-request-bulk-number-lookup",
  name: "Request Bulk Number Lookup",
  description: "Perform a bulk number lookup, to later fetch the results when the operation is finished. [See the documentation](https://lookup.api-docs.commpeak.com/?_gl=1*50xs02*_gcl_au*MTMxMzgzMzA3Ny4xNjk3NTY0NDE3#cda1e4c3-963e-4d9e-b9a7-16b6616bdda5)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    commpeak,
    keys: {
      type: "integer[]",
      label: "Numbers",
      description: "The numbers to perform the lookup on. Up to 200 phone numbers are supported per a single request.",
    },
    requestType: {
      propDefinition: [
        commpeak,
        "requestType",
      ],
    },
    respondUrl: {
      type: "string",
      label: "Respond URL",
      description: "The URL to which results will be sent as a callback once they're ready. This can be the URL of an HTTP source. Alternatively, you can use the **Get Bulk Lookup Results** action to fetch the results manually.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.commpeak.requestBulkNumberLookup({
      $,
      requestType: this.requestType,
      data: {
        keys: this.keys.map((key) => ({
          key,
        })),
        ...(this.respondUrl && {
          respond_url: this.respondUrl,
          respond_method: "post_json",
        }),
      },
    });
    $.export("$summary", `Successfully requested bulk lookup (task id: ${response.task_id})`);
    return response;
  },
};
