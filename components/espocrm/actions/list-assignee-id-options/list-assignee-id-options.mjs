import espocrm from "../../espocrm.app.mjs";

export default {
  key: "espocrm-list-assignee-id-options",
  name: "List Assigned User Options",
  description: "Retrieves available options for the Assigned User field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    espocrm,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await espocrm.propDefinitions.assigneeId.options.call(this.espocrm, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
