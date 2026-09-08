import dataiku from "../../dataiku.app.mjs";

export default {
  key: "dataiku-list-projects",
  name: "List Projects",
  description: "List the projects on the DSS instance. Start here when you only know a project by its display name: every other Dataiku tool is addressed by `projectKey` (e.g. `MYPROJECT`), which this tool returns. Only projects the connected API key holds the `READ_CONF` privilege on are listed, so an empty result usually means a permissions gap rather than an empty instance. Note that the free edition of DSS does not include Public API access — the API key must come from a trial or licensed instance. [See the documentation](https://doc.dataiku.com/dss/api/15/rest/#projects-projects-get)",
  version: "0.0.2",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    dataiku,
    tags: {
      propDefinition: [
        dataiku,
        "tags",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.dataiku.listProjects({
      $,
      params: {
        tags: this.tags?.length
          ? this.tags.join(",")
          : undefined,
      },
    });
    $.export("$summary", `Found ${response?.length} project(s)`);
    return response;
  },
};
