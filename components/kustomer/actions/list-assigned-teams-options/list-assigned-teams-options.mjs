import kustomer from "../../kustomer.app.mjs";

export default {
  key: "kustomer-list-assigned-teams-options",
  name: "List Assigned Teams Options",
  description: "Retrieves available options for the Assigned Teams field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    kustomer,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await kustomer.propDefinitions.assignedTeams.options.call(this.kustomer, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
