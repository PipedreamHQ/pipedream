import loops from "../../loops_so.app.mjs";

export default {
  key: "loops_so-list-custom-fields",
  name: "List Custom Fields",
  description: "List your account's custom contact properties. [See the documentation](https://loops.so/docs/api-reference/list-custom-fields)",
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
    const response = await this.loops.listCustomFields({
      $,
    });

    $.export("$summary", `Successfully retrieved ${response.length} custom fields`);

    return response;
  },
};
