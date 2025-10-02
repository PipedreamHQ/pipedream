import wakatime from "../../wakatime.app.mjs";

export default {
  key: "wakatime-list-projects",
  name: "List Projects",
  description: "List all your WakaTime projects. [See the documentation](https://wakatime.com/developers#projects)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    wakatime,
    q: {
      type: "string",
      label: "Query",
      description: "Filter project names by a search term",
      optional: true,
    },
  },
  async run({ $ }) {
    const results = this.wakatime.paginate({
      fn: this.wakatime.listProjects,
      args: {
        $,
        params: {
          q: this.q,
        },
      },
    });

    const projects = [];
    for await (const project of results) {
      projects.push(project);
    }

    $.export("$summary", `Successfully retrieved ${projects.length} project${projects.length === 1
      ? ""
      : "s"}`);
    return projects;
  },
};
