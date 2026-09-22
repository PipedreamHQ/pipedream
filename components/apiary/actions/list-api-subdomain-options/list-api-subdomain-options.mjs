import apiary from "../../apiary.app.mjs";

export default {
  key: "apiary-list-api-subdomain-options",
  name: "List API Subdomain Options",
  description: "Retrieves available options for the API Subdomain field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    apiary,
  },
  async run({ $ }) {
    const options = await apiary.propDefinitions.apiSubdomain.options.call(this.apiary);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
