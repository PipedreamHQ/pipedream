import helpspot from "../../helpspot.app.mjs";

export default {
  key: "helpspot-get-request",
  name: "Get Request",
  description: "Retrieves a single support request by ID. [See the documentation](https://support.helpspot.com/index.php?pg=kb.page&id=164#private.request.get)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    helpspot,
    xRequest: {
      propDefinition: [
        helpspot,
        "xRequest",
      ],
    },
    fRawValues: {
      type: "boolean",
      label: "Raw Values",
      description: "Set to `true` to return numeric values instead of their text representations (e.g. status IDs instead of status names).",
      optional: true,
    },
    fIncludeTimeTotal: {
      type: "boolean",
      label: "Include Time Total",
      description: "Set to `true` to include total tracked time as `iTimeTotal` (seconds) and `sTimeTotal` (formatted string) in the response.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.helpspot.getRequest({
      $,
      params: {
        xRequest: this.xRequest,
        ...(this.fRawValues !== undefined && {
          fRawValues: +this.fRawValues,
        }),
        ...(this.fIncludeTimeTotal !== undefined && {
          fIncludeTimeTotal: +this.fIncludeTimeTotal,
        }),
      },
    });

    $.export("$summary", `Successfully retrieved request with Id: ${response.xRequest}`);
    return response;
  },
};
