import hiver from "../../hiver.app.mjs";

export default {
  key: "hiver-list-all-tags-in-inbox",
  name: "List All Tags In Inbox",
  description: "Get all tags associated with a Hiver inbox. [See the documentation](https://developer.hiverhq.com/hiver-api/inbox/get-tags-in-the-inbox)",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    hiver,
    inboxId: {
      propDefinition: [
        hiver,
        "inboxId",
      ],
    },
    limit: {
      type: "integer",
      label: "Page Size",
      description: "Number of tags to fetch per page (10–100). Defaults to 50. All pages are automatically fetched.",
      optional: true,
      min: 10,
      max: 100,
    },
  },
  async run({ $ }) {
    const results = [];
    let nextPage;
    do {
      const response = await this.hiver.listInboxTags({
        $,
        inboxId: this.inboxId,
        params: {
          limit: this.limit ?? 50,
          next_page: nextPage ?? undefined,
        },
      });
      results.push(...response.results);
      nextPage = response.pagination?.next_page ?? null;
    } while (nextPage);
    $.export("$summary", `Successfully retrieved ${results.length} tag(s) from inbox ${this.inboxId}`);
    return results;
  },
};
