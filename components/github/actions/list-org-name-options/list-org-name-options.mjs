import github from "../../github.app.mjs";

export default {
  key: "github-list-org-name-options",
  name: "List Organization Options",
  description: "Retrieves available options for the Organization field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    github,
  },
  async run({ $ }) {
    const options = await github.propDefinitions.orgName.options.call(this.github);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
