import wakatime from "../../wakatime.app.mjs";

export default {
  key: "wakatime-list-projects",
  name: "List Projects",
  description: "List all your WakaTime projects. [See the documentation](https://wakatime.com/developers#projects)",
  version: "0.0.1",
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
    const { data } = await this.wakatime.listProjects({
      $,
      params: {
        q: this.q,
      },
    });
    $.export("$summary", `Successfully retrieved ${data.length} project${data.length === 1
      ? ""
      : "s"}`);
    return data;
  },
};
