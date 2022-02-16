export default {
  async run ({ $ }) {
    const {
      max,
      postedAtStart,
      cashAccount,
    } = this;

    const items = await this.brexApp._paginate(
      max || 500,
      {
        method: "GET",
        path: `/v2/transactions/cash/${cashAccount}`,
        params: {
          posted_at_start: postedAtStart,
        },
      },
    );

    if (items.length === 0) {
      $.export("$summary", "No transactions fetched");
    } else {
      $.export("$summary", `Successfully fetched ${items.length} transaction(s)`);
    }
    return items;
  },
};
