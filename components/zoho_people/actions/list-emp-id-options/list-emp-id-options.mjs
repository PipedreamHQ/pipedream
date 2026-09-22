import zoho_people from "../../zoho_people.app.mjs";

export default {
  key: "zoho_people-list-emp-id-options",
  name: "List Employee ID Options",
  description: "Retrieves available options for the Employee ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    zoho_people,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await zoho_people.propDefinitions.empId.options.call(this.zoho_people, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
