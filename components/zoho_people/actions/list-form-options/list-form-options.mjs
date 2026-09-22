import zoho_people from "../../zoho_people.app.mjs";

export default {
  key: "zoho_people-list-form-options",
  name: "List Form Options",
  description: "Retrieves available options for the Form field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    zoho_people,
  },
  async run({ $ }) {
    const options = await zoho_people.propDefinitions.form.options.call(this.zoho_people);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
