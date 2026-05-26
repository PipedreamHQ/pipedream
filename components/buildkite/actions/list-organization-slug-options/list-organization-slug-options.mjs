import buildkite from "../../buildkite.app.mjs";

export default {
  key: "buildkite-list-organization-slug-options",
  name: "List Organization Slug Options",
  description: "Retrieves available options for the Organization Slug field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    buildkite,
  },
  async run({ $ }) {
    const options = await buildkite.propDefinitions.organizationSlug.options.call(this.buildkite);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
