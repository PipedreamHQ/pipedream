import hiver from "../../hiver.app.mjs";

export default {
  key: "hiver-list-all-inboxes",
  name: "List All Inboxes",
  description: "List all the inboxes in your Hiver account. [See the documentation](https://developer.hiverhq.com/hiver-api/inbox/list-all-the-inboxes)",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    hiver,
    limit: {
      type: "integer",
      label: "Page Size",
      description: "Number of inboxes to fetch per page (10–100). Defaults to 50. All pages are automatically fetched.",
      optional: true,
      min: 10,
      max: 100,
    },
  },
  async run({ $ }) {
    const results = [];
    let nextPage;
    do {
      const response = await this.hiver.listInboxes({
        $,
        params: {
          limit: this.limit ?? 50,
          next_page: nextPage ?? undefined,
        },
      });
      results.push(...response.results);
      nextPage = response.pagination?.next_page ?? null;
    } while (nextPage);
    $.export("$summary", `Successfully retrieved ${results.length} inbox(es)`);
    return results;
  },
};
