import bitbucket from "../../bitbucket.app.mjs";

export default {
  key: "bitbucket-list-workspace-options",
  name: "List Workspace Options",
  description: "Retrieves available options for the Workspace field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    bitbucket,
  },
  async run({ $ }) {
    const results = [];
    let page = 0;
    while (true) {
      const options = await bitbucket.propDefinitions.workspace.options
        .call(this.bitbucket, {
          page,
        });
      if (!options?.length) break;
      results.push(...options);
      page++;
    }
    $.export("$summary", `Successfully retrieved ${results.length} option${results.length === 1
      ? ""
      : "s"}`);
    return results;
  },
};
