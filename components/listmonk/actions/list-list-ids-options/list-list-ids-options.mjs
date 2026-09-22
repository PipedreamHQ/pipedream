import listmonk from "../../listmonk.app.mjs";

export default {
  key: "listmonk-list-list-ids-options",
  name: "List Lists Options",
  description: "Retrieves available options for the Lists field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    listmonk,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await listmonk.propDefinitions.listIds.options.call(this.listmonk, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
