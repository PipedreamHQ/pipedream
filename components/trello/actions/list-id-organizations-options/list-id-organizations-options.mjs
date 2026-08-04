import trello from "../../trello.app.mjs";

export default {
  key: "trello-list-id-organizations-options",
  name: "List Organization IDs Options",
  description: "Retrieves available options for the Organization IDs field.",
  version: "0.0.3",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    trello,
  },
  async run({ $ }) {
    const options = await trello.propDefinitions.idOrganizations.options.call(this.trello);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
