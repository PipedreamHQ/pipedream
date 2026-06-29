import app from "../../mindbody.app.mjs";

export default {
  key: "mindbody-get-client-purchases",
  name: "Get Client Purchases",
  description:
    "Returns the paginated list of purchases made by a specific Mindbody client, including amount/price fields."
    + " Sum the amounts across all pages to compute the client's lifetime spend."
    + " Requires the client's numeric ID - use **Search Clients** first to look up the ID by name or email."
    + " IMPORTANT: the API defaults `startDate` to today and `endDate` to end of today, so for true lifetime spend you MUST set `startDate` to an early date (e.g. `2000-01-01`) and page through all results via `offset`."
    + " [See the documentation](https://developers.mindbodyonline.com/ui/documentation/public-api#/http/api-endpoints/client/get-client-purchases)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    clientId: {
      propDefinition: [
        app,
        "clientId",
      ],
    },
    startDate: {
      propDefinition: [
        app,
        "startDate",
      ],
    },
    endDate: {
      propDefinition: [
        app,
        "endDate",
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
    const response = await this.app.getClientPurchases({
      $,
      params: {
        ClientId: this.clientId,
        StartDate: this.startDate,
        EndDate: this.endDate,
        Limit: this.limit,
        Offset: this.offset,
      },
    });
    const purchases = response.Purchases || [];
    $.export("$summary", `Retrieved ${purchases.length} purchase record${purchases.length === 1
      ? ""
      : "s"} for client ${this.clientId}`);
    return response;
  },
};
