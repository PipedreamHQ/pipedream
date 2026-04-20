import coda from "../../coda.app.mjs";

export default {
  key: "coda-list-pages",
  name: "List Pages",
  description: "List all pages in a document. [See docs](https://coda.io/developers/apis/v1#tag/Pages/operation/listPages)",
  version: "0.0.1",
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
    max: {
      propDefinition: [
        coda,
        "max",
      ],
    },
  },
  async run({ $ }) {
    let params = {};
    let items = [];
    let response;
    do {
      response = await this.coda.listPages(
        $,
        this.docId,
      );
      items.push(...response.items);
      params.pageToken = response.nextPageToken;
    } while (params.pageToken && items.length < this.max);

    if (items.length > this.max) items.length = this.max;

    $.export("$summary", `Retrieved ${items.length} page(s)`);
    return items;
  },
};
