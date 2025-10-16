import app from "../../tableau.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "tableau-query-projects",
  name: "Query Projects",
  description: "Returns a list of projects on the specified site. [See the documentation](https://help.tableau.com/current/api/rest_api/en-us/REST/rest_api_ref_projects.htm)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    siteId: {
      propDefinition: [
        app,
        "siteId",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      siteId,
    } = this;

    const projects = await app.paginate({
      resourcesFn: app.listProjects,
      resourcesFnArgs: {
        $,
        siteId,
        params: {
          pageSize: constants.DEFAULT_LIMIT,
        },
      },
      resourceName: "projects.project",
    });

    $.export("$summary", `Successfully retrieved \`${projects.length}\` project(s)`);
    return projects;
  },
};
