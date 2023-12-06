import vendasta from "../../vendasta.app.mjs";

export default {
  key: "vendasta-list-proposals",
  name: "List Proposals",
  description: "Retrieves a list of proposals in Vendasta. [See the documentation](https://developers.vendasta.com/platform/d95ef3e3a451b-list-proposals)",
  version: "0.0.1",
  type: "action",
  props: {
    vendasta,
  },
  async run({ $ }) {
    const items = this.vendasta.paginate({
      resourceFn: this.vendasta.listProposals,
      args: {
        $,
      },
    });

    const proposals = [];
    for await (const item of items) {
      proposals.push(item);
    }

    $.export("$summary", `Successfully retrieved ${proposals.length} proposal${proposals.length === 1
      ? ""
      : "s"}.`);

    return proposals;
  },
};
