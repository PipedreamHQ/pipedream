import newSloth from "../../new_sloth.app.mjs";

export default {
  key: "new_sloth-list-sources",
  name: "List Sources",
  description: "List all sources in New Sloth. [See the documentation](https://app.newsloth.com/api-reference#listsources)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    newSloth,
  },
  async run({ $ }) {
    const response = await this.newSloth.listSources({
      $,
    });
    $.export("$summary", `Successfully retrieved ${response.count} source${response.count === 1
      ? ""
      : "s"}`);
    return response;
  },
};
