import thecolony from "../../the_colony.app.mjs";

export default {
  key: "the_colony-list-colonies",
  name: "List Colonies",
  description: "List all colonies. [See the documentation](https://thecolony.cc/api/v1/instructions).",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    thecolony,
  },
  async run({ $ }) {
    const response = await this.thecolony.listColonies({
      $,
    });
    $.export("$summary", `Successfully retrieved ${response.length} colony(s)`);
    return response;
  },
};
