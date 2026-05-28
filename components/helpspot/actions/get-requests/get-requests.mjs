import helpspot from "../../helpspot.app.mjs";

export default {
  key: "helpspot-get-requests",
  name: "Get Requests",
  description: "Retrieves multiple support requests by ID in a single call. [See the documentation](https://support.helpspot.com/index.php?pg=kb.page&id=164#private.request.multiGet)",
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
      type: "string[]",
      label: "Request IDs",
      description: "The IDs of the requests to retrieve.",
      propDefinition: [
        helpspot,
        "xRequest",
      ],
    },
    fIncludeTimeTotal: {
      type: "boolean",
      label: "Include Time Total",
      description: "Set to `true` to include total tracked time as `iTimeTotal` (seconds) and `sTimeTotal` (formatted string) in each response.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.helpspot.multiGet({
      $,
      params: {
        xRequest: this.xRequest,
        ...(this.fIncludeTimeTotal !== undefined && {
          fIncludeTimeTotal: +this.fIncludeTimeTotal,
        }),
      },
    });

    const requests = Array.isArray(response)
      ? response
      : [
        response,
      ];
    $.export("$summary", `Successfully retrieved ${requests.length} request${requests.length === 1
      ? ""
      : "s"}`);
    return response;
  },
};
