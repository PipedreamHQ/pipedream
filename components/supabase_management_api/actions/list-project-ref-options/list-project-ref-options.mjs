import supabase_management_api from "../../supabase_management_api.app.mjs";

export default {
  key: "supabase_management_api-list-project-ref-options",
  name: "List Project Reference Options",
  description: "Retrieves available options for the Project Reference field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    supabase_management_api,
  },
  async run({ $ }) {
    const options = await supabase_management_api.propDefinitions.projectRef.options
      .call(this.supabase_management_api);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
