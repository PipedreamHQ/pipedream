import donately from "../../donately.app.mjs";

export default {
  key: "donately-list-people",
  name: "List People",
  description: "List people for an account. [See the documentation](https://developer.donate.ly/api/#people)",
  version: "0.0.1",
  type: "action",
  annotations: {
    openWorldHint: true,
    destructiveHint: false,
    readOnlyHint: true,
  },
  props: {
    donately,
    accountId: {
      propDefinition: [
        donately,
        "accountId",
      ],
    },
    keyword: {
      type: "string",
      label: "Keyword",
      description: "	Search by name or email",
      optional: true,
    },
    limit: {
      propDefinition: [
        donately,
        "limit",
      ],
    },
    offset: {
      propDefinition: [
        donately,
        "offset",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.donately.listPeople({
      $,
      params: {
        account_id: this.accountId,
        keyword: this.keyword,
        limit: this.limit,
        offset: this.offset,
      },
    });
    const count = response?.data?.length ?? 0;
    $.export("$summary", `Found ${count} person${count === 1
      ? ""
      : "s"}`);
    return response;
  },
};
