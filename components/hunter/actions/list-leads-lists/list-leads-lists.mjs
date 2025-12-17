import app from "../../hunter.app.mjs";

export default {
  key: "hunter-list-leads-lists",
  name: "List Leads Lists",
  description: "List all your leads lists. The leads lists are returned in sorted order, with the most recent leads lists appearing first. [See the documentation](https://hunter.io/api-documentation/v2#list-leads-lists).",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    limit: {
      propDefinition: [
        app,
        "limit",
      ],
      description: "A limit on the number of lists to be returned. Limit can range between 1 and 100 lists. Default is 20.",
    },
  },
  async run({ $ }) {
    const {
      app,
      limit,
    } = this;

    const response = await app.listLeadsLists({
      $,
      params: {
        limit,
      },
    });

    $.export("$summary", "Successfully retrieved leads lists");
    return response;
  },
};
