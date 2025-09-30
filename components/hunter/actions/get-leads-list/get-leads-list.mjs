import app from "../../hunter.app.mjs";

export default {
  key: "hunter-get-leads-list",
  name: "Get Leads List",
  description: "Retrieves all the fields of a leads list, including its leads. [See the documentation](https://hunter.io/api-documentation/v2#get-leads-list).",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    leadsListId: {
      propDefinition: [
        app,
        "leadsListId",
      ],
      description: "Identifier of the leads list to retrieve.",
    },
    limit: {
      propDefinition: [
        app,
        "limit",
      ],
      description: "A limit on the number of leads to be returned. Limit can range between 1 and 100. Default is 20.",
    },
  },
  async run({ $ }) {
    const {
      app,
      leadsListId,
      limit,
    } = this;

    const response = await app.getLeadsList({
      $,
      leadsListId,
      params: {
        limit,
      },
    });

    $.export("$summary", `Successfully retrieved leads list ${leadsListId}`);
    return response;
  },
};
