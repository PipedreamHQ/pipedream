import hiver from "../../hiver.app.mjs";

export default {
  key: "hiver-list-all-users-in-inbox",
  name: "List All Users In Inbox",
  description: "Get all users associated with a Hiver inbox. [See the documentation](https://developer.hiverhq.com/hiver-api/inbox/get-all-users-in-the-inbox)",
  version: "0.0.3",
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
      description: "Number of users to fetch per page (10-100). Defaults to 50. All pages are automatically fetched.",
      optional: true,
      min: 10,
      max: 100,
    },
  },
  async run({ $ }) {
    const results = [];
    let nextPage;
    do {
      const response = await this.hiver.listInboxUsers({
        $,
        inboxId: this.inboxId,
        params: {
          limit: this.limit ?? 50,
          next_page: nextPage ?? undefined,
        },
      });
      results.push(...(response.results ?? []));
      nextPage = response.pagination?.next_page ?? null;
      if (nextPage) await new Promise((r) => setTimeout(r, 1000));
    } while (nextPage);
    $.export("$summary", `Successfully retrieved ${results.length} user(s) from inbox ${this.inboxId}`);
    return results;
  },
};
