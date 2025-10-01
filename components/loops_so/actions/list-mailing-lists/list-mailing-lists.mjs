import loops from "../../loops_so.app.mjs";

export default {
  key: "loops_so-list-mailing-lists",
  name: "List Mailing Lists",
  description: "List your account's mailing lists. [See the documentation](https://loops.so/docs/api-reference/list-mailing-lists)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    loops,
  },
  async run({ $ }) {
    const response = await this.loops.listMailingLists({
      $,
    });

    $.export("$summary", `Successfully retrieved ${response.length} mailing lists`);

    return response;
  },
};
