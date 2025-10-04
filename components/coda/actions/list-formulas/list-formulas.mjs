import coda from "../../coda.app.mjs";

export default {
  key: "coda-list-formulas",
  name: "List Formulas",
  description: "Lists formulas in a doc. [See docs](https://coda.io/developers/apis/v1#tag/Formulas/operation/listFormulas)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    coda,
    docId: {
      propDefinition: [
        coda,
        "docId",
      ],
    },
    sortBy: {
      propDefinition: [
        coda,
        "sortBy",
      ],
    },
  },
  async run({ $ }) {
    let params = {
      sortBy: this.sortBy,
    };

    let items = [];
    let response;
    do {
      response = await this.coda.listFormulas(
        $,
        this.docId,
        params,
      );

      items.push(...response.items);
      params.pageToken = response.nextPageToken;
    } while (params.pageToken);

    $.export("$summary", `Retrieved ${items.length} formula(s)`);
    return items;
  },
};
