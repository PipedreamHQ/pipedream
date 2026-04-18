import hiver from "../../hiver.app.mjs";

export default {
  key: "hiver-list-all-users-in-inbox",
  name: "List All Users In Inbox",
  description: "Get all users associated with a Hiver inbox. [See the documentation](https://developer.hiverhq.com/hiver-api/inbox/get-all-users-in-the-inbox)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: false,
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
      label: "Limit",
      description: "Maximum number of users to return per page (10–100). Defaults to 50.",
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
        inboxId: this.inboxId,
        params: {
          limit: this.limit ?? 50,
          next_page: nextPage ?? undefined,
        },
      });
      results.push(...response.data.results);
      nextPage = response.data.pagination?.next_page ?? null;
    } while (nextPage);
    $.export("$summary", `Successfully retrieved ${results.length} user(s) from inbox ${this.inboxId}`);
    return results;
  },
};
