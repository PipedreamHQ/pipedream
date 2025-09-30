import zohoProjects from "../../zoho_projects.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "zoho_projects-find-project",
  name: "Find Project",
  description: "Lists the modules across the portal based on the search term. The API returns both active and archived projects for the users having admin privileges. [See the docs here](https://www.zoho.com/projects/help/rest-api/search-api.html#alink1)",
  type: "action",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    zohoProjects,
    portalId: {
      propDefinition: [
        zohoProjects,
        "portalId",
      ],
    },
    searchTerm: {
      type: "string",
      label: "Search Term",
      description: "Specify the search term. E.g. `NE4-I1`",
    },
    module: {
      type: "string",
      label: "Module",
      description: "Specify the module name.",
      options: constants.MODULES_OPTIONS,
    },
  },
  async run({ $ }) {
    const {
      portalId,
      searchTerm,
      module,
    } = this;

    const response =
      await this.zohoProjects.searchProject({
        $,
        portalId,
        params: {
          search_term: searchTerm,
          module,
        },
      });

    $.export("$summary", "Successfully searched term on projects");

    return response;
  },
};
