import coda from "../../coda.app.mjs";

export default {
  key: "coda-get-page",
  name: "Get Page Content",
  description: "Fetch the content of a single page by name or ID. [See docs](https://coda.io/developers/apis/v1#tag/Pages/operation/getPage)",
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
    pageId: {
      propDefinition: [
        coda,
        "pageId",
        (c) => ({
          docId: c.docId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.coda.getPage(
      $,
      this.docId,
      this.pageId,
    );

    $.export("$summary", `Successfully fetched page with ID ${response.id}.`);

    return response;
  },
};
