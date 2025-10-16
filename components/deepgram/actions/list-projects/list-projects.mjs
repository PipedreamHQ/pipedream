import deepgram from "../../deepgram.app.mjs";

export default {
  key: "deepgram-list-projects",
  name: "List Projects",
  description: "Retrieves basic information about the specified project. [See the documentation](https://developers.deepgram.com/api-reference/projects/#get-projects)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    deepgram,
  },
  async run({ $ }) {
    const { projects } = await this.deepgram.listProjects({
      $,
    });

    if (projects) {
      $.export("$summary", `Successfully retrieved ${projects.length} project${projects.length === 1
        ? ""
        : "s"}`);
    }

    return projects;
  },
};
